'use strict';
/**
 * ElectIQ — Main Application Module
 * Navigation, theme toggle, loader, guide tabs, toast, keyboard shortcuts.
 * @module app
 */

/* ── Toast utility (global) ── */
window.showToast = function showToast(message, type) {
  type = type || "default";
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.className   = "toast show " + type;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(function() {
    toast.className = "toast";
  }, 3500);
};

/* ── Main App ── */
window.App = (() => {
  /* ── DOM refs ── */
  const loader      = document.getElementById("loader");
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon   = themeToggle.querySelector(".theme-icon");
  const hamburger   = document.getElementById("hamburger");
  const mobileNav   = document.getElementById("mobileNav");

  /** @type {Object<string, HTMLElement>} Section map */
  const sections = {
    home:     document.getElementById("section-home"),
    timeline: document.getElementById("section-timeline"),
    guide:    document.getElementById("section-guide"),
    quiz:     document.getElementById("section-quiz"),
    chat:     document.getElementById("section-chat"),
  };

  /** Section display names for screen readers */
  const SECTION_TITLES = {
    home: "Home", timeline: "Election Timeline",
    guide: "Voter Guide", quiz: "Civic Quiz", chat: "AI Chat"
  };

  /* ── Accessibility announcer ── */
  const announcer = document.createElement("div");
  announcer.setAttribute("aria-live", "polite");
  announcer.setAttribute("aria-atomic", "true");
  announcer.className = "sr-only";
  announcer.style.cssText = "position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden";
  document.body.appendChild(announcer);

  /**
   * Navigate to a section by ID.
   * @param {string} sectionId - One of: home, timeline, guide, quiz, chat
   */
  function navigateTo(sectionId) {
    const target = sections[sectionId];
    if (!target) return;

    Object.values(sections).forEach(s => s.classList.remove("active"));
    target.classList.add("active");

    document.querySelectorAll(".nav-btn").forEach(btn => {
      const isActive = btn.getAttribute("data-section") === sectionId;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-current", isActive ? "page" : "false");
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
    history.replaceState(null, "", "#" + sectionId);

    // Close mobile nav
    mobileNav.classList.remove("open");
    mobileNav.setAttribute("aria-hidden", "true");
    hamburger.setAttribute("aria-expanded", "false");

    // Screen reader announcement
    announcer.textContent = "Navigated to " + (SECTION_TITLES[sectionId] || sectionId);
  }

  /* ── Bind nav buttons ── */
  document.querySelectorAll("[data-section]").forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const sec = el.getAttribute("data-section");
      if (sec) navigateTo(sec);
    });
  });

  /* ── Handle deep links ── */
  function handleHash() {
    const hash = window.location.hash.replace("#", "");
    if (hash && sections[hash]) navigateTo(hash);
  }
  window.addEventListener("hashchange", handleHash);

  /* ── Theme Toggle ── */
  const savedTheme = localStorage.getItem("electiq-theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  /**
   * Apply and persist theme.
   * @param {"light"|"dark"} theme
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    themeIcon.textContent = theme === "dark" ? "🌙" : "☀️";
    localStorage.setItem("electiq-theme", theme);
  }

  applyTheme(savedTheme);

  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  });

  /* ── Hamburger / Mobile Nav ── */
  hamburger.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("open");
    mobileNav.setAttribute("aria-hidden", String(!isOpen));
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });

  /* ── Guide Tabs ── */
  const guideTabs   = document.querySelectorAll(".guide-tab");
  const guidePanels = document.querySelectorAll(".guide-panel");

  guideTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetTab = tab.getAttribute("data-tab");
      guideTabs.forEach(t => {
        const isActive = t.getAttribute("data-tab") === targetTab;
        t.classList.toggle("active", isActive);
        t.setAttribute("aria-selected", String(isActive));
        t.setAttribute("tabindex", isActive ? "0" : "-1");
      });
      guidePanels.forEach(p => {
        const panelId = p.id.replace("tabpanel-", "");
        p.classList.toggle("active", panelId === targetTab);
      });
    });

    // Arrow key navigation between tabs
    tab.addEventListener("keydown", (e) => {
      const tabs = Array.from(guideTabs);
      const idx = tabs.indexOf(tab);
      let newIdx = -1;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        newIdx = (idx + 1) % tabs.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        newIdx = (idx - 1 + tabs.length) % tabs.length;
      }
      if (newIdx >= 0) {
        e.preventDefault();
        tabs[newIdx].click();
        tabs[newIdx].focus();
      }
    });
  });

  /* ── Skip link ── */
  const skipLink = document.createElement("a");
  skipLink.href  = "#main-content";
  skipLink.className = "skip-link";
  skipLink.textContent = "Skip to main content";
  document.body.prepend(skipLink);

  /* ── Loader ── */
  function hideLoader() {
    loader.classList.add("hidden");
    loader.setAttribute("aria-hidden", "true");
    handleHash();
  }

  const loadTimeout = Math.max(1900, performance.now() > 1900 ? 0 : 1900 - performance.now());
  setTimeout(hideLoader, loadTimeout);

  /* ── Keyboard shortcuts ── */
  document.addEventListener("keydown", (e) => {
    if (e.altKey) {
      const sectionMap = { "1": "home", "2": "timeline", "3": "guide", "4": "quiz", "5": "chat" };
      if (sectionMap[e.key]) {
        e.preventDefault();
        navigateTo(sectionMap[e.key]);
        showToast("Navigated to " + (SECTION_TITLES[sectionMap[e.key]] || sectionMap[e.key]), "default");
      }
    }
  });

  /* ── Service Worker Registration ── */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js")
        .then(() => console.log("SW registered"))
        .catch(err => console.warn("SW registration failed:", err));
    });
  }

  return { navigateTo };
})();
