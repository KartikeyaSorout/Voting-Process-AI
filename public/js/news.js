'use strict';
/**
 * ElectIQ — News Feed Module
 * Displays curated election news with live-fetch fallback.
 * @module news
 */

window.NewsModule = (() => {
  const newsFeed = document.getElementById("newsFeed");

  /** @type {Array<{tag:string, title:string, summary:string, date:string, url:string}>} */
  const STATIC_NEWS = [
    { tag: "ECI Update", title: "Election Commission Launches 'Voter Awareness Festival' 2024", summary: "The ECI kicked off a nationwide voter literacy campaign encouraging citizens to verify their names on electoral rolls.", date: "May 2025", url: "https://eci.gov.in" },
    { tag: "Technology", title: "New Voter Helpline App Features Real-Time Booth Updates", summary: "The Voter Helpline app now shows live queue estimates at polling booths and GPS-based booth location.", date: "Apr 2025", url: "https://voters.eci.gov.in" },
    { tag: "Democracy", title: "India Completes Revision of Electoral Rolls for 2024–25", summary: "Summary Revision completed across all states, adding over 2.5 crore new voters.", date: "Mar 2025", url: "https://eci.gov.in" },
    { tag: "Voter Rights", title: "Supreme Court Upholds EVM Reliability in Landmark Ruling", summary: "The Supreme Court dismissed petitions challenging EVM integrity, reaffirming security of EVMs and VVPAT.", date: "Feb 2025", url: "https://sci.gov.in" },
    { tag: "Registration", title: "Youth Voters: Over 1.8 Crore First-Time Voters Register", summary: "Historic surge in youth voter registrations, with 18–19 age group forming the largest new cohort since 2019.", date: "Jan 2025", url: "https://nvsp.in" },
    { tag: "Inclusion", title: "ECI Launches Assisted Voting Booths for Persons with Disabilities", summary: "Wheelchair ramps, Braille EVMs, and volunteer-assisted voting at select booths in 200 pilot constituencies.", date: "Jan 2025", url: "https://eci.gov.in" },
  ];

  /**
   * Escape HTML special characters.
   * @param {string} str
   * @returns {string}
   */
  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str || "";
    return d.innerHTML;
  }

  /**
   * Render news cards into the feed.
   * @param {Array} items
   */
  function renderNews(items) {
    newsFeed.innerHTML = "";
    items.forEach((item, i) => {
      const card = document.createElement("article");
      card.className = "news-card";
      card.style.animationDelay = (i * 0.08) + "s";
      card.style.animation = "fadeUp 0.5s ease both";
      card.innerHTML =
        '<span class="nc-tag">' + escapeHtml(item.tag) + '</span>' +
        '<h4>' + escapeHtml(item.title) + '</h4>' +
        '<p>' + escapeHtml(item.summary) + '</p>' +
        '<div class="nc-date">📅 ' + escapeHtml(item.date) + '</div>';
      card.style.cursor = "pointer";
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "link");
      card.setAttribute("aria-label", item.title);
      card.addEventListener("click", () => window.open(item.url, "_blank", "noopener,noreferrer"));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          window.open(item.url, "_blank", "noopener,noreferrer");
        }
      });
      newsFeed.appendChild(card);
    });
  }

  /**
   * Try fetching live news, fallback to static.
   * @returns {Promise<void>}
   */
  async function tryFetchLiveNews() {
    try {
      const resp = await fetch("/api/news", { signal: AbortSignal.timeout(4000) });
      if (!resp.ok) throw new Error("Non-OK");
      const data = await resp.json();
      if (data.articles && data.articles.length > 0) {
        renderNews(data.articles);
        return;
      }
    } catch (_) {
      // Silently fall back to static
    }
    renderNews(STATIC_NEWS);
  }

  /* ── Lazy load via IntersectionObserver ── */
  const homeSection = document.getElementById("section-home");
  if (homeSection) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        tryFetchLiveNews();
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    observer.observe(homeSection);
  }

  return {};
})();
