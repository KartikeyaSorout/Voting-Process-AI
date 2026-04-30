'use strict';
/**
 * ElectIQ — AI Chat Module
 * AI-powered election Q&A with fallback responses.
 * Saves chat history to Firestore for authenticated users.
 * @module chat
 */

const ChatModule = (() => {
  /* ── Constants ── */
  const API_ENDPOINT = "/api/chat";
  const MAX_HISTORY  = 20;
  const RATE_LIMIT_MS = 2000;
  const MAX_INPUT_LENGTH = 500;

  const SYSTEM_PROMPT = `You are ElectIQ, a friendly and knowledgeable AI assistant specializing in the Indian election process.

Your expertise covers:
- Voter registration (NVSP portal, Form 6, eligibility)
- Election timeline and phases
- EVM (Electronic Voting Machine) and VVPAT machines
- Model Code of Conduct
- Nomination and candidate filing process
- Polling day procedures (voting steps, indelible ink, booth finding)
- Vote counting and result declaration
- Government formation (majority, coalition, floor test)
- Indian Constitution's electoral provisions (Articles 324–329)
- Political parties, symbols, and alliances
- Reservation in constituencies (SC/ST seats)

Tone: Friendly, clear, accurate, and educational.
Language: Respond in the same language the user writes in (English or Hindi).
Length: Keep answers concise (3–5 sentences) unless detailed explanation requested.
Format: Use bullet points only when helpful. Do NOT use Markdown headers.
Disclaimer: You provide general civic education — not legal advice. Direct users to voters.eci.gov.in.`;

  let conversationHistory = [];
  let currentSessionId    = null;
  let isTyping            = false;
  let lastSendTime        = 0;

  /* ── DOM refs ── */
  const messagesContainer = document.getElementById("chatMessages");
  const chatForm          = document.getElementById("chatForm");
  const chatInput         = document.getElementById("chatInput");
  const sendBtn           = document.getElementById("sendBtn");
  const typingIndicator   = document.getElementById("typingIndicator");
  const clearBtn          = document.getElementById("clearChat");
  const charCount         = document.getElementById("charCount");
  const historyList       = document.getElementById("chatHistoryList");

  /**
   * Escape HTML to prevent XSS.
   * @param {string} str
   * @returns {string}
   */
  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str || "";
    return d.innerHTML;
  }

  /**
   * Sanitize user input — trim and limit length.
   * @param {string} input
   * @returns {string}
   */
  function sanitizeInput(input) {
    return (input || "").trim().substring(0, MAX_INPUT_LENGTH);
  }

  /* ── Input handling ── */
  chatInput.addEventListener("input", () => {
    const len = chatInput.value.length;
    charCount.textContent = Math.min(len, MAX_INPUT_LENGTH);
    sendBtn.disabled = len === 0 || isTyping;
    chatInput.style.height = "auto";
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + "px";
  });

  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!sendBtn.disabled) submitMessage();
    }
  });

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    submitMessage();
  });

  /* ── Quick questions ── */
  document.querySelectorAll(".qq-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const q = btn.getAttribute("data-q");
      if (q) {
        chatInput.value = q;
        chatInput.dispatchEvent(new Event("input"));
        submitMessage();
      }
    });
  });

  /**
   * Submit a chat message with rate limiting.
   * @returns {Promise<void>}
   */
  async function submitMessage() {
    const now = Date.now();
    if (now - lastSendTime < RATE_LIMIT_MS) {
      showToast("Please wait a moment before sending another message.", "default");
      return;
    }

    const text = sanitizeInput(chatInput.value);
    if (!text || isTyping) return;

    lastSendTime = now;
    chatInput.value = "";
    chatInput.style.height = "auto";
    charCount.textContent  = "0";
    sendBtn.disabled = true;

    appendMessage("user", text);
    conversationHistory.push({ role: "user", content: text });

    if (conversationHistory.length > MAX_HISTORY) {
      conversationHistory = conversationHistory.slice(-MAX_HISTORY);
    }

    await fetchAIResponse(text);
  }

  /**
   * Fetch AI response from backend or use fallback.
   * @param {string} userText
   * @returns {Promise<void>}
   */
  async function fetchAIResponse(userText) {
    isTyping = true;
    typingIndicator.classList.remove("hidden");
    typingIndicator.setAttribute("aria-label", "AI is thinking...");
    scrollToBottom();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: SYSTEM_PROMPT,
          messages: conversationHistory,
          max_tokens: 600
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data    = await response.json();
      const aiReply = data.content?.[0]?.text || data.reply || "I couldn't process that. Please try again.";

      conversationHistory.push({ role: "assistant", content: aiReply });
      typingIndicator.classList.add("hidden");
      appendMessage("bot", aiReply);

      await saveChatToFirestore(userText, aiReply);
    } catch (err) {
      console.error("AI fetch error:", err);
      typingIndicator.classList.add("hidden");
      const fallback = getFallbackResponse(userText);
      conversationHistory.push({ role: "assistant", content: fallback });
      appendMessage("bot", fallback);
    } finally {
      isTyping = false;
      sendBtn.disabled = chatInput.value.length === 0;
    }
  }

  /**
   * Get a useful fallback response when API is unavailable.
   * @param {string} query
   * @returns {string}
   */
  function getFallbackResponse(query) {
    const q = (query || "").toLowerCase();
    const responses = [
      { keys: ["register", "registration"], reply: "To register as a voter, visit **voters.eci.gov.in** and fill **Form 6**. You need to be 18+ and an Indian citizen. You'll need Aadhaar, an address proof, and a passport-size photo. Processing takes up to 30 days." },
      { keys: ["evm", "electronic voting"], reply: "EVMs (Electronic Voting Machines) have two units — the **Control Unit** (with the polling officer) and the **Ballot Unit** (where you vote). They are standalone devices with no internet/WiFi. A VVPAT machine shows a paper confirmation slip for 7 seconds." },
      { keys: ["nota"], reply: "**NOTA** stands for 'None Of The Above'. Introduced in 2013 by the Supreme Court, it lets voters express dissatisfaction with all candidates. Even if NOTA gets the most votes, the candidate with the next highest votes wins." },
      { keys: ["mcc", "model code", "conduct"], reply: "The **Model Code of Conduct (MCC)** is a set of rules by the ECI that kicks in from election announcement day. Parties cannot announce new schemes, ads require ECI approval, and there's a 48-hour silent period before voting." },
      { keys: ["result", "count", "counting"], reply: "Vote counting begins at **8 AM on counting day**. EVMs are opened constituency by constituency with candidates' agents present. India uses **FPTP** — the candidate with the most votes wins. Results are published live on ECI website." },
      { keys: ["government", "majority", "coalition"], reply: "To form a government, a party or coalition needs **272+ seats** (simple majority of 543). The President invites the majority leader. The PM takes oath, then appoints the Council of Ministers (max 15% of Lok Sabha strength)." },
      { keys: ["document", "voter id", "id proof"], reply: "For voting you can use: **Voter ID (EPIC)**, Aadhaar, Passport, Driving Licence, PAN card, MNREGA Job Card, Bank/Post Office Passbook (with photo), or Govt Employee ID. Carry any one valid photo ID." },
      { keys: ["phase", "dates", "schedule"], reply: "Indian general elections are conducted in **multiple phases** (7 phases in 2024) across different states. The ECI announces the schedule, and voting happens over several weeks to ensure security forces can be deployed across the country." },
      { keys: ["who can vote", "eligible", "eligibility"], reply: "Any **Indian citizen aged 18+** on January 1st of the qualifying year, who is ordinarily resident in a constituency, can register to vote. You must not be disqualified under any law (e.g., unsound mind, corrupt practices)." },
    ];

    for (const r of responses) {
      if (r.keys.some(k => q.includes(k))) return r.reply;
    }

    return "I'm your ElectIQ AI assistant! 🗳️ I can help you understand Indian elections — voter registration, EVMs, timelines, government formation, NOTA, and more.\n\nWhat would you like to know?";
  }

  /**
   * Append a message to the chat UI.
   * @param {"user"|"bot"} role
   * @param {string} text
   */
  function appendMessage(role, text) {
    const div = document.createElement("div");
    div.className = `chat-msg ${role}`;
    div.setAttribute("role", "article");
    div.setAttribute("aria-label", role === "bot" ? "AI response" : "Your message");

    const avatar = document.createElement("div");
    avatar.className = "msg-avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = role === "bot" ? "🤖" : "👤";

    const bubble = document.createElement("div");
    bubble.className = "msg-bubble";
    bubble.innerHTML = formatMessage(text);

    div.appendChild(avatar);
    div.appendChild(bubble);
    messagesContainer.appendChild(div);

    requestAnimationFrame(() => {
      div.style.opacity = "0";
      div.style.transform = "translateY(8px)";
      requestAnimationFrame(() => {
        div.style.transition = "opacity 0.3s, transform 0.3s";
        div.style.opacity = "1";
        div.style.transform = "translateY(0)";
      });
    });

    scrollToBottom();
  }

  /**
   * Format message text with safe markdown-like rendering.
   * @param {string} text
   * @returns {string} Safe HTML
   */
  function formatMessage(text) {
    let safe = escapeHtml(text);
    safe = safe
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br/>")
      .replace(/^(.+)/, "<p>$1")
      .replace(/(.+)$/, "$1</p>");
    return safe;
  }

  /** Scroll chat to bottom smoothly. */
  function scrollToBottom() {
    requestAnimationFrame(() => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
  }

  /* ── Clear chat ── */
  clearBtn.addEventListener("click", () => {
    conversationHistory = [];
    messagesContainer.innerHTML = "";
    appendMessage("bot", "Chat cleared! Ask me anything about Indian elections. 🗳️");
    currentSessionId = null;
  });

  /**
   * Save chat exchange to Firestore.
   * @param {string} userMsg
   * @param {string} botMsg
   * @returns {Promise<void>}
   */
  async function saveChatToFirestore(userMsg, botMsg) {
    const user = AuthModule.getCurrentUser();
    if (!user) return;

    try {
      if (!currentSessionId) {
        const sessionRef = await db.collection("chatSessions").add({
          uid:          user.uid,
          title:        (userMsg || "").substring(0, 60),
          createdAt:    firebase.firestore.FieldValue.serverTimestamp(),
          messageCount: 0
        });
        currentSessionId = sessionRef.id;
        loadChatHistory();
      }

      await db.collection("chatSessions").doc(currentSessionId)
        .collection("messages").add({
          userMsg: (userMsg || "").substring(0, 2000),
          botMsg:  (botMsg || "").substring(0, 5000),
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

      await db.collection("chatSessions").doc(currentSessionId).update({
        messageCount: firebase.firestore.FieldValue.increment(1),
        lastMessage:  (userMsg || "").substring(0, 60)
      });

      await db.collection("users").doc(user.uid).update({
        chatCount: firebase.firestore.FieldValue.increment(1)
      });
    } catch (err) {
      console.error("Firestore chat save error:", err);
    }
  }

  /**
   * Load chat history from Firestore for the sidebar.
   * @returns {Promise<void>}
   */
  async function loadChatHistory() {
    const user = AuthModule.getCurrentUser();
    if (!user) {
      historyList.innerHTML = `<p class="history-empty">Sign in to save chats</p>`;
      return;
    }
    try {
      const snap = await db.collection("chatSessions")
        .where("uid", "==", user.uid)
        .orderBy("createdAt", "desc")
        .limit(8)
        .get();

      if (snap.empty) {
        historyList.innerHTML = `<p class="history-empty">No saved chats yet</p>`;
        return;
      }

      historyList.innerHTML = "";
      snap.forEach(doc => {
        const data = doc.data();
        const item = document.createElement("button");
        item.className = "history-item";
        item.textContent = data.title || "Chat session";
        item.setAttribute("title", data.title || "Chat session");
        item.setAttribute("aria-label", `Load chat: ${data.title || "Chat session"}`);
        item.addEventListener("click", () => loadSession(doc.id));
        historyList.appendChild(item);
      });
    } catch (err) {
      console.error("Load history error:", err);
    }
  }

  /**
   * Load a previous chat session.
   * @param {string} sessionId
   * @returns {Promise<void>}
   */
  async function loadSession(sessionId) {
    try {
      const snap = await db.collection("chatSessions")
        .doc(sessionId).collection("messages")
        .orderBy("timestamp", "asc").limit(20).get();

      messagesContainer.innerHTML = "";
      conversationHistory = [];
      currentSessionId = sessionId;

      snap.forEach(doc => {
        const { userMsg, botMsg } = doc.data();
        if (userMsg) appendMessage("user", userMsg);
        if (botMsg) appendMessage("bot", botMsg);
        if (userMsg) conversationHistory.push({ role: "user", content: userMsg });
        if (botMsg) conversationHistory.push({ role: "assistant", content: botMsg });
      });

      showToast("Chat session loaded", "success");
    } catch (err) {
      console.error("Load session error:", err);
      showToast("Failed to load chat session.", "error");
    }
  }

  /* ── Auth listener ── */
  document.addEventListener("authStateChanged", ({ detail: { user } }) => {
    if (user) loadChatHistory();
    else historyList.innerHTML = `<p class="history-empty">Sign in to save chats</p>`;
  });

  return { sendMessage: submitMessage };
})();
