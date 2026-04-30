'use strict';
/**
 * ElectIQ — Authentication Module
 * Handles Google Sign-In, user profile display, Firestore user documents.
 * @module auth
 */

window.AuthModule = (() => {
  /** @type {firebase.User|null} Currently signed-in user */
  let currentUser = null;

  const googleProvider = new firebase.auth.GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: "select_account" });

  /* ── DOM References ── */
  const authBtn        = document.getElementById("authBtn");
  const profileModal   = document.getElementById("profileModal");
  const profileContent = document.getElementById("profileContent");
  const signOutBtn     = document.getElementById("signOutBtn");
  const modalClose     = profileModal.querySelector(".modal-close");
  const modalOverlay   = profileModal.querySelector(".modal-overlay");

  /**
   * Sign in with Google popup.
   * Creates/updates user document in Firestore on success.
   * @returns {Promise<void>}
   */
  async function signInWithGoogle() {
    try {
      const result = await auth.signInWithPopup(googleProvider);
      await ensureUserDoc(result.user);
      showToast(`Welcome, ${result.user.displayName}! 🎉`, "success");
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        console.error("Auth error:", err);
        showToast("Sign-in failed. Please try again.", "error");
      }
    }
  }

  /**
   * Sign out the current user.
   * @returns {Promise<void>}
   */
  async function signOut() {
    try {
      await auth.signOut();
      currentUser = null;
      closeModal();
      showToast("You've been signed out.", "success");
    } catch (err) {
      console.error("Sign-out error:", err);
      showToast("Sign-out failed. Please try again.", "error");
    }
  }

  /**
   * Create or update user document in Firestore.
   * @param {firebase.User} user - The authenticated user
   * @returns {Promise<void>}
   */
  async function ensureUserDoc(user) {
    if (!user || !user.uid) return;
    const ref = db.collection("users").doc(user.uid);
    try {
      const snap = await ref.get();
      if (!snap.exists) {
        await ref.set({
          uid:         user.uid,
          displayName: user.displayName || "Anonymous",
          email:       user.email || "",
          photoURL:    user.photoURL || "",
          createdAt:   firebase.firestore.FieldValue.serverTimestamp(),
          quizBest:    0,
          chatCount:   0,
        });
      } else {
        await ref.update({
          lastSeen: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
    } catch (err) {
      console.error("Firestore user doc error:", err);
    }
  }

  /**
   * Update auth button UI based on user state.
   * @param {firebase.User|null} user
   */
  function updateAuthUI(user) {
    if (user) {
      const safeName = escapeHtml(user.displayName || "User");
      const firstName = safeName.split(" ")[0];
      authBtn.innerHTML = user.photoURL
        ? `<img src="${escapeHtml(user.photoURL)}" alt="${safeName}" referrerpolicy="no-referrer" /><span>${firstName}</span>`
        : `<span>${firstName}</span>`;
      authBtn.setAttribute("aria-label", `Profile of ${safeName}`);
    } else {
      authBtn.innerHTML = `<span>Sign In</span>`;
      authBtn.setAttribute("aria-label", "Sign in with Google");
    }
  }

  /**
   * Escape HTML special characters to prevent XSS.
   * @param {string} str - Raw string
   * @returns {string} Escaped string
   */
  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str || "";
    return d.innerHTML;
  }

  /**
   * Show the user profile modal.
   * @param {firebase.User} user
   */
  function showProfileModal(user) {
    const safeName  = escapeHtml(user.displayName || "User");
    const safeEmail = escapeHtml(user.email || "");
    const safePhoto = escapeHtml(user.photoURL || "");
    profileContent.innerHTML = `
      <div class="profile-info">
        ${safePhoto ? `<img src="${safePhoto}" alt="${safeName}" referrerpolicy="no-referrer" />` : ""}
        <strong>${safeName}</strong>
        <span>${safeEmail}</span>
      </div>
    `;
    profileModal.classList.remove("hidden");
    profileModal.setAttribute("aria-hidden", "false");
    trapFocus(profileModal);
    signOutBtn.focus();
  }

  /** Close the profile modal and return focus. */
  function closeModal() {
    profileModal.classList.add("hidden");
    profileModal.setAttribute("aria-hidden", "true");
    authBtn.focus();
  }

  /**
   * Trap focus inside the modal for accessibility.
   * @param {HTMLElement} modal
   */
  function trapFocus(modal) {
    const focusable = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    modal._trapHandler = function(e) {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    modal.addEventListener("keydown", modal._trapHandler);
  }

  /* ── Event Listeners ── */
  authBtn.addEventListener("click", () => {
    if (currentUser) { showProfileModal(currentUser); }
    else { signInWithGoogle(); }
  });

  signOutBtn.addEventListener("click", signOut);
  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !profileModal.classList.contains("hidden")) {
      closeModal();
    }
  });

  /* ── Auth State Observer ── */
  auth.onAuthStateChanged((user) => {
    currentUser = user;
    updateAuthUI(user);
    document.dispatchEvent(new CustomEvent("authStateChanged", { detail: { user } }));
  });

  /* ── Public API ── */
  return {
    getCurrentUser: () => currentUser,
    signIn: signInWithGoogle,
    signOut,
  };
})();
