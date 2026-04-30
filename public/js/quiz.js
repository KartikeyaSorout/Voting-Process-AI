'use strict';
/**
 * ElectIQ — Civic Quiz Module
 * 10 randomized questions, scoring, badges, Firestore persistence.
 * @module quiz
 */

window.QuizModule = (() => {
  /* ── Questions Bank ── */
  const ALL_QUESTIONS = [
    { q: "What is the minimum voting age in India?", options: ["16 years", "18 years", "21 years", "25 years"], ans: 1, explanation: "The 61st Constitutional Amendment (1988) lowered the voting age from 21 to 18 years." },
    { q: "Which constitutional article establishes the Election Commission of India?", options: ["Article 243", "Article 312", "Article 324", "Article 356"], ans: 2, explanation: "Article 324 vests the superintendence, direction, and control of elections in the ECI." },
    { q: "How many seats are there in the Lok Sabha?", options: ["250", "543", "545", "552"], ans: 1, explanation: "The Lok Sabha has 543 elected seats." },
    { q: "What does FPTP stand for in electoral systems?", options: ["First Past The Post", "Formal Party Transfer Protocol", "Final Poll Tally Process", "Federal Parliament Transfer Procedure"], ans: 0, explanation: "FPTP (First Past The Post) — the candidate with the most votes wins." },
    { q: "What is the 'Model Code of Conduct'?", options: ["A code of ethics for judges", "Guidelines for election officials", "Rules for political parties & candidates during elections", "A rulebook for media coverage"], ans: 2, explanation: "The MCC is guidelines by ECI for parties and candidates to ensure free and fair elections." },
    { q: "Full form of VVPAT in Indian elections?", options: ["Verified Voter Proof and Audit Trail", "Voter Verifiable Paper Audit Trail", "Valid Vote Print and Tally", "Verified Vote Paper Accounting Trail"], ans: 1, explanation: "VVPAT produces a paper slip showing the voter's choice for 7 seconds." },
    { q: "What is NOTA in Indian elections?", options: ["None Of The Above", "National Online Tally Application", "New Opposition Terms Act", "Nominee Of The Assembly"], ans: 0, explanation: "NOTA was introduced by the Supreme Court in 2013 to express dissatisfaction with all candidates." },
    { q: "How many phases did the 2024 Indian General Election have?", options: ["5 phases", "6 phases", "7 phases", "8 phases"], ans: 2, explanation: "The 2024 election was conducted in 7 phases from April 19 to June 1, 2024." },
    { q: "What is the security deposit for Lok Sabha candidates in large states?", options: ["₹10,000", "₹15,000", "₹25,000", "₹50,000"], ans: 2, explanation: "₹25,000 for general candidates (₹12,500 for SC/ST). Forfeited if < 1/6th votes received." },
    { q: "Which document is NOT accepted as alternate ID at Indian polling booths?", options: ["Aadhaar Card", "PAN Card", "Ration Card (without photo)", "Driving Licence"], ans: 2, explanation: "A Ration Card without a photo is not accepted. All 12 valid IDs require a photo." },
  ];

  const TOTAL_QUESTIONS = 10;
  let questions = [];
  let currentQ  = 0;
  let score     = 0;
  let answered  = false;

  /* ── DOM refs ── */
  const startScreen   = document.getElementById("quiz-start");
  const gameScreen    = document.getElementById("quiz-game");
  const resultScreen  = document.getElementById("quiz-result");
  const startBtn      = document.getElementById("startQuiz");
  const retakeBtn     = document.getElementById("retakeQuiz");
  const shareBtn      = document.getElementById("shareQuiz");
  const nextBtn       = document.getElementById("nextQBtn");
  const progressFill  = document.getElementById("quizProgressFill");
  const counterEl     = document.getElementById("quizCounter");
  const scoreEl       = document.getElementById("quizScore");
  const questionText  = document.getElementById("questionText");
  const optionsGrid   = document.getElementById("optionsGrid");
  const feedbackBox   = document.getElementById("feedbackBox");
  const badgeEl       = document.getElementById("quizBadge");
  const resultTitle   = document.getElementById("quizResultTitle");
  const resultScore   = document.getElementById("quizResultScore");
  const resultMsg     = document.getElementById("quizResultMsg");
  const quizUserDisp  = document.getElementById("quizUserDisplay");
  const progressBar   = document.querySelector(".quiz-progress-bar");

  /**
   * Shuffle an array using Fisher-Yates.
   * @param {Array} arr
   * @returns {Array}
   */
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /** Start a new quiz session. */
  function startQuiz() {
    questions = shuffle(ALL_QUESTIONS).slice(0, TOTAL_QUESTIONS);
    currentQ  = 0;
    score     = 0;
    answered  = false;

    startScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    showQuestion();
  }

  /** Display the current question. */
  function showQuestion() {
    if (currentQ >= questions.length) { showResult(); return; }

    const q = questions[currentQ];
    answered = false;

    const pct = (currentQ / questions.length) * 100;
    progressFill.style.width = pct + "%";
    progressBar.setAttribute("aria-valuenow", currentQ);
    counterEl.textContent = "Question " + (currentQ + 1) + " / " + questions.length;
    scoreEl.textContent   = "Score: " + score;

    questionText.textContent = q.q;

    optionsGrid.innerHTML = "";
    optionsGrid.setAttribute("aria-label", "Options for: " + q.q);
    q.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.className   = "option-btn";
      btn.textContent = opt;
      btn.setAttribute("aria-label", "Option " + (idx + 1) + ": " + opt);
      btn.addEventListener("click", () => handleAnswer(idx));
      optionsGrid.appendChild(btn);
    });

    feedbackBox.classList.add("hidden");
    feedbackBox.className = "feedback-box hidden";
    nextBtn.classList.add("hidden");
  }

  /**
   * Handle answer selection.
   * @param {number} selected - Index of selected option
   */
  function handleAnswer(selected) {
    if (answered) return;
    answered = true;

    const q       = questions[currentQ];
    const opts    = optionsGrid.querySelectorAll(".option-btn");
    const correct = selected === q.ans;

    opts.forEach(b => { b.disabled = true; b.setAttribute("aria-disabled", "true"); });
    opts[q.ans].classList.add("correct");
    if (!correct) opts[selected].classList.add("wrong");

    feedbackBox.textContent = (correct ? "✅ Correct! " : "❌ Wrong. ") + q.explanation;
    feedbackBox.classList.remove("hidden", "correct-fb", "wrong-fb");
    feedbackBox.classList.add(correct ? "correct-fb" : "wrong-fb");

    if (correct) score++;
    scoreEl.textContent = "Score: " + score;

    nextBtn.classList.remove("hidden");
    nextBtn.focus();
  }

  /** Display quiz results and save score. */
  function showResult() {
    gameScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");
    progressFill.style.width = "100%";

    const pct = (score / questions.length) * 100;
    let badge, title, msg;

    if (pct === 100)     { badge = "🏆"; title = "Perfect Score!";  msg = "Outstanding! You're a true democracy champion."; }
    else if (pct >= 80)  { badge = "🥇"; title = "Excellent!";      msg = "Strong grasp of India's electoral process."; }
    else if (pct >= 60)  { badge = "🥈"; title = "Great Job!";      msg = "Good knowledge — review the Guide for a perfect score!"; }
    else if (pct >= 40)  { badge = "🥉"; title = "Keep Learning!";  msg = "You're on the right track. Read our Voter Guide."; }
    else                 { badge = "📚"; title = "Room to Grow!";   msg = "Start with our Timeline and Voter Guide sections."; }

    badgeEl.textContent     = badge;
    resultTitle.textContent = title;
    resultScore.textContent = "You scored " + score + " out of " + questions.length + " (" + Math.round(pct) + "%)";
    resultMsg.textContent   = msg;

    saveScore(score, pct, badge);
  }

  /**
   * Save quiz score to Firestore.
   * @param {number} s - Score
   * @param {number} pct - Percentage
   * @param {string} badge - Badge emoji
   */
  async function saveScore(s, pct, badge) {
    const user = AuthModule.getCurrentUser();
    if (!user) return;
    try {
      await db.collection("quizScores").add({
        uid: user.uid, name: user.displayName || "Anonymous",
        score: s, total: questions.length, pct: Math.round(pct),
        badge, timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });

      const userRef = db.collection("users").doc(user.uid);
      const snap = await userRef.get();
      if (snap.exists && s > (snap.data().quizBest || 0)) {
        await userRef.update({ quizBest: s });
        showToast("🏅 New high score: " + s + "/" + questions.length + "!", "success");
      }
    } catch (err) {
      console.error("Score save error:", err);
    }
  }

  /** Share quiz score via Web Share API or clipboard. */
  function shareScore() {
    const text = "I scored " + score + "/" + questions.length + " on the ElectIQ Civic Quiz! 🗳️ Test your knowledge: " + window.location.href;
    if (navigator.share) {
      navigator.share({ text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text)
        .then(() => showToast("Score copied to clipboard!", "success"))
        .catch(() => showToast("Could not copy score.", "error"));
    }
  }

  /* ── Auth listener ── */
  document.addEventListener("authStateChanged", ({ detail: { user } }) => {
    quizUserDisp.textContent = user
      ? "Logged in as " + (user.displayName || "User") + " — scores will be saved!"
      : "Sign in to save your score to the leaderboard.";
  });

  /* ── Bind buttons ── */
  startBtn.addEventListener("click", startQuiz);
  retakeBtn.addEventListener("click", () => {
    resultScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
  });
  shareBtn.addEventListener("click", shareScore);
  nextBtn.addEventListener("click", () => { currentQ++; showQuestion(); });

  return { startQuiz };
})();
