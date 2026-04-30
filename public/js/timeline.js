'use strict';
/**
 * ElectIQ — Timeline Filter Module
 * Filters timeline events by election phase.
 * @module timeline
 */

window.TimelineModule = (() => {
  const filterBtns = document.querySelectorAll(".tf-btn");
  const events     = document.querySelectorAll(".timeline-event");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const phase = btn.getAttribute("data-phase");

      filterBtns.forEach(b => {
        const isActive = b === btn;
        b.classList.toggle("active", isActive);
        b.setAttribute("aria-pressed", String(isActive));
      });

      let visibleCount = 0;
      events.forEach(ev => {
        const evPhase = ev.getAttribute("data-phase");
        if (phase === "all" || evPhase === phase) {
          ev.classList.remove("hidden");
          ev.style.animation = "fadeUp 0.4s ease both";
          ev.style.animationDelay = (visibleCount * 0.08) + "s";
          visibleCount++;
        } else {
          ev.classList.add("hidden");
          ev.style.animation = "";
        }
      });
    });
  });

  // Set initial aria-pressed state
  filterBtns.forEach(b => {
    b.setAttribute("aria-pressed", b.classList.contains("active") ? "true" : "false");
  });

  return {};
})();
