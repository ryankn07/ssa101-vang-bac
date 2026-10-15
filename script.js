// SSA101 / Nhóm Vàng Bạc — cấu hình đơn giản.
// Chỉ điền link sau khi Google Form chính thức đã được tạo và kiểm tra.
const SITE_CONFIG = {
  registrationUrl: "https://docs.google.com/forms/d/e/1FAIpQLSdvFnYiceiT-sh13q3ggggmLMSz9ifyf6zQS6-JSGxH60DN2w/viewform",
  logoUrl: "assets/logo-vang-bac-transparent.svg", // Đặt logo gốc tại đây. Nếu chưa có, giữ biểu tượng VB.
  youtubeEmbedUrl: ""   // Ví dụ: "https://www.youtube.com/embed/VIDEO_ID"
};

const weekdays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const weekModel = [
  ["navy","gray","","orange"],
  ["gray","orange","",""],
  ["navy","","gray",""],
  ["","orange","","navy"],
  ["gray","navy","", ""],
  ["","", "gray", ""],
  ["","","", ""]
];

function renderWeek() {
  return `<div class="weekly-calendar" aria-label="Minh họa lịch tuần">${weekdays.map((day, i) => `<div class="week-day"><span>${day}</span>${weekModel[i].map(color => `<div class="day-block ${color}"></div>`).join("")}</div>`).join("")}</div>`;
}
function renderMonth() {
  const cells = weekdays.map(day => `<div class="month-cell head">${day}</div>`);
  for (let day = 1; day <= 28; day++) {
    const cls = [3, 11, 19, 25].includes(day) ? "selected" : [5, 8, 17, 23].includes(day) ? "planned" : "";
    cells.push(`<div class="month-cell ${cls}">${day}</div>`);
  }
  return `<div class="month-calendar" aria-label="Minh họa lịch tháng">${cells.join("")}</div>`;
}

const content = document.getElementById("calendar-content");
const buttons = document.querySelectorAll(".toggle-button");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let currentView = "week";
let viewTimer = 0;
let revealFrame = 0;

function setView(view, immediate = false) {
  if (view === currentView && !immediate) return;
  currentView = view;
  buttons.forEach(button => {
    const selected = button.dataset.view === view;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  window.clearTimeout(viewTimer);
  window.cancelAnimationFrame(revealFrame);
  const draw = () => content.innerHTML = view === "month" ? renderMonth() : renderWeek();
  if (immediate || reducedMotion.matches) {
    content.classList.remove("is-exiting", "is-entering");
    draw();
    return;
  }
  content.classList.remove("is-entering");
  content.classList.add("is-exiting");
  viewTimer = window.setTimeout(() => {
    draw();
    content.classList.remove("is-exiting");
    content.classList.add("is-entering");
    // Two frames guarantee the browser paints the starting state before reveal.
    revealFrame = window.requestAnimationFrame(() => {
      revealFrame = window.requestAnimationFrame(() => {
        content.classList.remove("is-entering");
      });
    });
  }, 215);
}
buttons.forEach(button => button.addEventListener("click", () => setView(button.dataset.view)));
setView("week", true);

/*
 * V4 / Five coordinated motion layers:
 * 01 entrance; 02 one-time scroll reveals; 03 scroll-linked parallax;
 * 04 unobtrusive ambient movement; 05 hover/click interactions.
 * One IntersectionObserver for reveal, one rAF for scroll-position work.
 */
const revealSelectors = [
  ".hero-topline", ".hero-title-stack", ".hero-intro", ".hero-art", ".hero-ticker",
  ".about > .section-tag", ".about > .section-title-row", ".problem-grid",
  ".outcomes .section-tag", ".outcomes-title", ".outcomes-grid",
  ".roadmap > .section-tag", ".roadmap > .section-title-row", ".session-row",
  ".demo .section-tag", ".demo .section-title-row", ".demo-stage", ".demo-caveat",
  ".video-section > .section-tag", ".video-layout", ".faq-lead", ".faq-questions",
  ".register-card"
];
let revealObserver;
let ambientObserver;
let heroOnScreen = true;
const revealElements = [...document.querySelectorAll(revealSelectors.join(","))];

function updateAmbient() {
  document.body.classList.toggle("ambient-paused", document.hidden || !heroOnScreen || reducedMotion.matches);
}

function initMotion() {
  if (reducedMotion.matches || !("IntersectionObserver" in window)) return;
  revealElements.forEach(el => el.classList.add("reveal"));
  [".hero-topline", ".hero-title-stack", ".hero-intro", ".hero-art", ".hero-ticker"]
    .forEach((sel, i) => document.querySelector(sel)?.style.setProperty("--reveal-delay", `${i * 95}ms`));
  document.querySelectorAll(".session-row")
    .forEach((el, i) => el.style.setProperty("--reveal-delay", `${(i % 3) * 60}ms`));

  // Reveal each section once. Replaying on every scroll-back caused distracting
  // fade-outs and unnecessary observer work on long calendar case studies.
  // The negative bottom margin anticipates the next section's entrance.
  revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  }, { threshold: 0, rootMargin: "0px 0px -7% 0px" });
  revealElements.forEach(el => revealObserver.observe(el));

  const hero = document.querySelector(".hero");
  ambientObserver = new IntersectionObserver(entries => {
    heroOnScreen = entries[0]?.isIntersecting ?? false;
    updateAmbient();
  });
  if (hero) ambientObserver.observe(hero);

  document.documentElement.classList.add("motion-ready");
  updateAmbient();
}
initMotion();
document.addEventListener("visibilitychange", updateAmbient);

/* V4 performance: read all geometry outside scroll frames; animate compositor-friendly transforms. */
const progressBar = document.getElementById("reading-progress-bar");
const header = document.querySelector(".site-header");
const motionLayers = [
  { element: document.querySelector(".hero"), variable: "--hero-shift", distance: 23 },
  { element: document.querySelector(".hero-art"), variable: "--art-scroll-shift", distance: 17 },
  { element: document.querySelector(".outcomes"), variable: "--outcomes-shift", distance: 24 },
  { element: document.querySelector(".demo-stage"), variable: "--demo-shift", distance: 16 },
  { element: document.querySelector(".register"), variable: "--register-shift", distance: 20 }
].filter(layer => layer.element);

let scrollTicking = false;
let pendingMeasurements = false;
let maxScroll = 1;
function measureMotion() {
  pendingMeasurements = false;
  // Batch geometry reads. No layout measurements in the scroll rAF below.
  const sy = window.scrollY;
  maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  motionLayers.forEach(layer => {
    const r = layer.element.getBoundingClientRect();
    layer.top = r.top + sy;
    layer.height = r.height;
  });
  scheduleScrollUpdate();
}
function scheduleMeasure() {
  if (pendingMeasurements) return;
  pendingMeasurements = true;
  requestAnimationFrame(measureMotion);
}
function updateScrollState() {
  scrollTicking = false;
  if (document.hidden) return;
  const sy = window.scrollY;
  const progress = Math.min(1, Math.max(0, sy / maxScroll));
  progressBar.style.transform = `scaleX(${progress})`;
  header.classList.toggle("is-scrolled", sy > 18);
  if (reducedMotion.matches) return;
  const vh = window.innerHeight;
  const strength = window.innerWidth <= 800 ? .55 : 1;
  for (const layer of motionLayers) {
    const top = layer.top - sy;
    if (top + layer.height < -60 || top > vh + 60) continue;
    const normalized = Math.max(-1, Math.min(1,
      (vh * .5 - (top + layer.height * .5)) / (vh * .5 + layer.height * .5)));
    const value = Math.round(normalized * layer.distance * strength);
    if (layer.lastValue !== value) {
      layer.element.style.setProperty(layer.variable, `${value}px`);
      layer.lastValue = value;
    }
  }
}
function scheduleScrollUpdate() {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(updateScrollState);
}
window.addEventListener("scroll", scheduleScrollUpdate, { passive: true });
window.addEventListener("resize", scheduleMeasure, { passive: true });
window.addEventListener("load", scheduleMeasure, { once: true });
document.fonts?.ready.then(scheduleMeasure);
scheduleMeasure();

/* Pointer parallax: one geometry read on entry, one composited write per frame. */
const heroArt = document.querySelector(".hero-art");
if (heroArt && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let pointerRect = null;
  let pointerFrame = 0;
  let pointerX = 0, pointerY = 0;
  heroArt.addEventListener("pointerenter", () => { pointerRect = heroArt.getBoundingClientRect(); }, { passive: true });
  heroArt.addEventListener("pointermove", event => {
    if (reducedMotion.matches || !pointerRect) return;
    pointerX = ((event.clientX - pointerRect.left) / pointerRect.width - .5) * 12;
    pointerY = ((event.clientY - pointerRect.top) / pointerRect.height - .5) * 10;
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      pointerFrame = 0;
      heroArt.style.setProperty("--art-x", `${pointerX.toFixed(1)}px`);
      heroArt.style.setProperty("--art-y", `${pointerY.toFixed(1)}px`);
    });
  }, { passive: true });
  heroArt.addEventListener("pointerleave", () => {
    pointerRect = null;
    if (pointerFrame) cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    heroArt.style.setProperty("--art-x", "0px");
    heroArt.style.setProperty("--art-y", "0px");
  });
  window.addEventListener("resize", () => { pointerRect = null; }, { passive: true });
}

reducedMotion.addEventListener?.("change", () => {
  // If Reduce Motion is enabled after load, strip all motion-related styles.
  if (reducedMotion.matches) {
    revealObserver?.disconnect();
    ambientObserver?.disconnect();
    revealElements.forEach(el => el.classList.add("is-visible"));
    for (const layer of motionLayers) layer.element.style.removeProperty(layer.variable);
    heroArt?.style.removeProperty("--art-x");
    heroArt?.style.removeProperty("--art-y");
  } else {
    revealObserver?.disconnect();
    ambientObserver?.disconnect();
    document.documentElement.classList.remove("motion-ready");
    revealElements.forEach(el => { el.classList.remove("reveal", "is-visible"); });
    initMotion();
  }
  updateAmbient();
  scheduleScrollUpdate();
});

const registrationLink = document.getElementById("registration-link");
const registrationStatus = document.getElementById("registration-status");
if (/^https:\/\/(docs\.google\.com\/forms\/|forms\.gle\/)/.test(SITE_CONFIG.registrationUrl)) {
  registrationLink.href = SITE_CONFIG.registrationUrl;
  registrationLink.target = "_blank";
  registrationLink.rel = "noopener noreferrer";
  registrationLink.removeAttribute("aria-disabled");
  registrationLink.classList.remove("is-unavailable");
  registrationLink.innerHTML = 'MỞ FORM ĐĂNG KÝ <span aria-hidden="true">↗</span>';
  document.querySelectorAll("[data-registration-link]").forEach(link => {
    link.href = SITE_CONFIG.registrationUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
  registrationStatus.textContent = "Bạn có thể xem thông tin và điền Google Form chính thức để đăng ký tham gia.";
}

if (/^https:\/\/www\.youtube\.com\/embed\/[A-Za-z0-9_-]+/.test(SITE_CONFIG.youtubeEmbedUrl)) {
  const frame = document.getElementById("video-slot");
  const iframe = document.createElement("iframe");
  iframe.src = SITE_CONFIG.youtubeEmbedUrl;
  iframe.title = "Video giới thiệu dự án quản lý thời gian của nhóm Vàng Bạc";
  iframe.loading = "lazy";
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;
  frame.replaceChildren(iframe);
}

// Logo official: load only if the original asset actually exists.
// Keep the text fallback to avoid broken-image icons while the asset is pending.
(function useOfficialIdentity(){
  if (!SITE_CONFIG.logoUrl) return;
  const preview = new Image();
  preview.onload = () => {
    const mark = document.querySelector('.brand-mark');
    if (!mark) return;
    if (!mark.querySelector('.official-logo')) {
      const logo = document.createElement('img');
      logo.src = SITE_CONFIG.logoUrl;
      logo.alt = '';
      logo.className = 'official-logo';
      mark.append(logo);
    }
    mark.classList.add('has-logo');
    const footerSlot = document.querySelector('.footer-logo-slot');
    if (footerSlot) {
      const footerLogo = document.createElement('img');
      footerLogo.src = SITE_CONFIG.logoUrl;
      footerLogo.alt = '';
      footerSlot.append(footerLogo);
    }
    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) { favicon = document.createElement('link'); favicon.rel = 'icon'; document.head.append(favicon); }
    favicon.href = SITE_CONFIG.logoUrl;
  };
  preview.src = SITE_CONFIG.logoUrl;
})();


/* Explicit back-to-top behavior. Do not rely on URL hash/anchor offsets: some
   browsers can land on a nearby section after layout changes or history restoration. */
document.querySelectorAll('[data-scroll-top]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    document.documentElement.classList.add('force-instant-top');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    requestAnimationFrame(() => document.documentElement.classList.remove('force-instant-top'));
  });
});
