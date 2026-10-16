/* VANG BAC / SSA101 — Navigation V5: accessible mobile menu + section states. */
(() => {
  "use strict";
  const header = document.querySelector(".site-header");
  const button = document.querySelector(".mobile-nav-toggle");
  const panel = document.getElementById("mobile-navigation");
  if (!header || !button || !panel) return;

  let isOpen = false;
  function setOpen(next, returnFocus = false) {
    isOpen = Boolean(next);
    panel.hidden = !isOpen;
    button.setAttribute("aria-expanded", String(isOpen));
    button.setAttribute("aria-label", isOpen ? "Đóng menu điều hướng" : "Mở menu điều hướng");
    document.body.classList.toggle("mobile-nav-is-open", isOpen);
    if (!isOpen && returnFocus) button.focus();
  }

  button.addEventListener("click", () => setOpen(!isOpen));
  panel.addEventListener("click", event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || !panel.contains(link)) return;
    const destination = document.getElementById(link.getAttribute("href").slice(1));
    setOpen(false);
    // Anchor navigation scrolls by default; after it completes, put keyboard
    // focus at that destination instead of leaving it in the hidden menu.
    if (destination) requestAnimationFrame(() => {
      if (!destination.hasAttribute("tabindex")) destination.setAttribute("tabindex", "-1");
      destination.focus({ preventScroll: true });
    });
  });
  document.addEventListener("pointerdown", event => {
    if (isOpen && !header.contains(event.target)) setOpen(false);
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && isOpen) setOpen(false, true);
  });
  // Closing the expanded menu after keyboard focus leaves its header prevents
  // an invisible-but-open menu from lingering while tabbing through the page.
  document.addEventListener("focusin", event => {
    if (isOpen && !header.contains(event.target)) setOpen(false);
  });

  const desktop = window.matchMedia("(min-width: 801px)");
  const handleBreakpoint = () => { if (desktop.matches && isOpen) setOpen(false); };
  if (desktop.addEventListener) desktop.addEventListener("change", handleBreakpoint);
  else desktop.addListener(handleBreakpoint);

  const links = [...document.querySelectorAll('.desktop-nav a[href^="#"], .mobile-navigation a[href^="#"]')];
  const sectionIds = [...new Set(links.map(link => link.getAttribute("href").slice(1)))];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  function setCurrent(id) {
    links.forEach(link => {
      const active = id !== "" && link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-current", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }

  // IntersectionObserver avoids a second scroll loop or synchronous layout reads.
  if ("IntersectionObserver" in window && sections.length) {
    const watcher = new IntersectionObserver(entries => {
      const entered = entries.filter(entry => entry.isIntersecting);
      if (!entered.length) return;
      entered.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      setCurrent(entered[0].target.id);
    }, { threshold: 0, rootMargin: "-20% 0px -65% 0px" });
    sections.forEach(section => watcher.observe(section));
  }
})();
