/* SSA101 / V8: opt-in Drive embeds and responsive before/after comparison. */
(() => {
  "use strict";

  // A third-party Google Drive embed is downloaded only after user intent.
  // Keep the existing external Drive links available if embedding is blocked.
  document.querySelectorAll("[data-vb-video-shell]").forEach(shell => {
    const gate = shell.querySelector(".vb-video-gate");
    const start = shell.querySelector(".vb-video-start");
    if (!gate || !start) return;

    start.addEventListener("click", () => {
      if (shell.classList.contains("vb-video-active")) return;
      const src = gate.getAttribute("data-vb-embed-url") || "";
      if (!/^https:\/\/drive\.google\.com\/file\/d\/[A-Za-z0-9_-]+\/preview$/.test(src)) return;

      const iframe = document.createElement("iframe");
      iframe.setAttribute("title", gate.getAttribute("data-vb-title") || "Video Time Management");
      iframe.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture");
      iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      iframe.setAttribute("allowfullscreen", "");
      iframe.src = src;
      gate.hidden = true;
      shell.classList.add("vb-video-active");
      shell.append(iframe);
    }, { once: true });
  });

  const compare = document.querySelector(".vb-calendar-slide .demo-stage");
  const cases = compare ? [...compare.querySelectorAll(":scope > .demo-case")] : [];
  if (!compare || cases.length !== 2) return;

  cases.forEach((el, i) => {
    el.classList.add("vb-compare-case");
    el.dataset.compareIndex = String(i);
  });

  const controls = document.createElement("div");
  controls.className = "vb-compare-controls";
  controls.setAttribute("role", "group");
  controls.setAttribute("aria-label", "Chọn lịch trước hoặc sau khi lập kế hoạch");
  const names = ["Trước khi lập lịch", "Sau khi lập lịch"];
  names.forEach((label, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.compareSelect = String(i);
    btn.textContent = (i === 0 ? "01 / " : "02 / ") + label;
    controls.append(btn);
  });
  compare.before(controls);
  const hint = document.createElement("p");
  hint.className = "vb-compare-context";
  hint.innerHTML = 'Chọn <strong>Trước</strong> hoặc <strong>Sau</strong> để xem ảnh lịch; bấm vào ảnh để xem đầy đủ.';
  controls.after(hint);

  function show(index) {
    if (index !== 0 && index !== 1) return;
    cases.forEach((el, i) => el.classList.toggle("is-active", i === index));
    controls.querySelectorAll("button").forEach((button, i) => {
      button.setAttribute("aria-pressed", String(i === index));
    });
  }
  controls.addEventListener("click", event => {
    const button = event.target.closest("[data-compare-select]");
    if (!button || !controls.contains(button)) return;
    show(Number(button.dataset.compareSelect));
  });
  show(0);
  compare.closest(".vb-calendar-slide")?.classList.add("vb-compare-ready");
})();