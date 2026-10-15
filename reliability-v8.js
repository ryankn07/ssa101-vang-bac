/* SSA101 / V9 — video resilience: loading is opt-in; Drive fallback never disappears. */
(() => {
  "use strict";
  document.querySelectorAll("[data-vb-video-shell]").forEach(shell => {
    const gate = shell.querySelector(".vb-video-gate");
    const start = gate?.querySelector(".vb-video-start");
    const originalLink = gate?.querySelector(".vb-video-drive-link");
    if (!gate || !start || !originalLink) return;

    const source = gate.getAttribute("data-vb-embed-url") || "";
    if (!/^https:\/\/drive\.google\.com\/file\/d\/[A-Za-z0-9_-]+\/preview$/.test(source)) return;

    // Controls remain above the iframe, even when the third-party player fails.
    const actions = document.createElement("div");
    actions.className = "vb-video-utility";
    actions.hidden = true;
    actions.setAttribute("aria-label", "Tùy chọn trình phát video");
    const drive = document.createElement("a");
    drive.className = "vb-video-utility-link";
    drive.href = originalLink.href;
    drive.target = "_blank";
    drive.rel = "noopener noreferrer";
    drive.textContent = "MỞ TRÊN DRIVE ↗";
    const close = document.createElement("button");
    close.type = "button";
    close.className = "vb-video-close";
    close.textContent = "ĐÓNG ×";
    close.setAttribute("aria-label", "Đóng trình phát, quay lại ảnh bìa video");
    actions.append(drive, close);
    shell.append(actions);

    let frame = null;
    function stop() {
      frame?.remove();
      frame = null;
      shell.classList.remove("vb-video-active");
      actions.hidden = true;
      gate.hidden = false;
      start.focus({ preventScroll: true });
    }
    function play() {
      if (frame) return;
      frame = document.createElement("iframe");
      frame.title = gate.getAttribute("data-vb-title") || "Video Time Management";
      frame.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture");
      frame.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      frame.setAttribute("allowfullscreen", "");
      frame.loading = "eager";
      frame.src = source;
      gate.hidden = true;
      shell.classList.add("vb-video-active");
      actions.hidden = false;
      shell.append(frame);
      // Once the cover disappears, move keyboard focus to a visible control.
      close.focus({ preventScroll: true });
    }
    start.addEventListener("click", play);
    close.addEventListener("click", stop);
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