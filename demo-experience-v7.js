/* SSA101 / VÀNG BẠC — Demo Experience V7, works with existing static calendar. */
(() => {
  "use strict";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const slider = document.getElementById("vb-calendar-switcher");
  const header = document.querySelector(".site-header");

  // Jump to an actual member panel without changing calendar content or data.
  document.querySelectorAll("[data-vb-open-slide]").forEach(link => {
    link.addEventListener("click", event => {
      if (!slider) return;
      const i = Number(link.dataset.vbOpenSlide);
      const tab = slider.querySelector('[data-vb-slide="' + i + '"]');
      if (!tab) return;
      event.preventDefault();
      tab.click();
      // The older slider updates its height in rAF; scroll only afterwards.
      requestAnimationFrame(() => {
        const offset = (header?.getBoundingClientRect().height || 0) + 13;
        const y = Math.max(0, slider.getBoundingClientRect().top + window.scrollY - offset);
        window.scrollTo({ top: y, left: 0, behavior: "instant" });
        // Keyboard users should land on the selected calendar tab after the jump.
        if (event.detail === 0) tab.focus({ preventScroll: true });
      });
    });
  });

  const calendar = document.getElementById("vb-week-calendar");
  const week = document.getElementById("vb-calendar-scroll");
  const days = [...document.querySelectorAll(".vb-day-nav [data-vb-day]")];
  const dayNav = document.querySelector(".vb-day-nav");
  if (!calendar || !week || days.length !== 7 || !dayNav) return;

  const labels = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ nhật"];
  let selected = 0;
  let mode = window.matchMedia("(max-width: 640px)").matches ? "list" : "grid";

  const panel = document.createElement("div");
  panel.className = "vb-day-explorer";
  panel.innerHTML = '<div><span class="vb-day-explorer-title">LỊCH ĐÃ LÊN KẾ HOẠCH</span>' +
    '<p class="vb-day-explorer-info" id="vb-day-current"></p>' +
    '<span class="vb-day-explorer-count" id="vb-day-count"></span></div>' +
    '<div class="vb-day-explorer-arrows">' +
    '<button type="button" data-vb-day-prev aria-label="Xem ngày trước">←</button>' +
    '<button type="button" data-vb-day-next aria-label="Xem ngày tiếp theo">→</button></div>';
  dayNav.after(panel);
  const summary = panel.querySelector("#vb-day-current");
  const count = panel.querySelector("#vb-day-count");
  panel.setAttribute("aria-live", "polite");

  const switcher = document.createElement("div");
  switcher.className = "vb-calendar-mode";
  switcher.innerHTML = '<span class="vb-calendar-mode-label">CHỌN CÁCH XEM</span>' +
    '<div class="vb-calendar-mode-actions" role="group" aria-label="Kiểu hiển thị lịch">' +
    '<button type="button" data-vb-cal-mode="list" aria-pressed="false">Danh sách theo ngày</button>' +
    '<button type="button" data-vb-cal-mode="grid" aria-pressed="true">Lịch theo giờ</button></div>';
  panel.after(switcher);
  const modeButtons = [...switcher.querySelectorAll("[data-vb-cal-mode]")];

  const agenda = document.createElement("ol");
  agenda.id = "vb-calendar-agenda";
  agenda.className = "vb-agenda-list";
  agenda.setAttribute("aria-label", "Các hoạt động theo ngày được chọn");
  calendar.append(agenda);

  const note = document.createElement("p");
  note.className = "vb-cal-context";
  note.innerHTML = '<strong>Lưu ý:</strong> Đây là các hoạt động đã lên lịch trong tuần 12–18/10/2026, không phải dữ liệu đồng bộ trực tiếp hay xác nhận hoàn thành.';
  calendar.after(note);

  function setMode(next) {
    mode = next === "list" ? "list" : "grid";
    week.hidden = mode !== "grid";
    agenda.hidden = mode !== "list";
    modeButtons.forEach(button =>
      button.setAttribute("aria-pressed", String(button.dataset.vbCalMode === mode))
    );
  }

  // Data comes from the existing displayed, privacy-filtered calendar events.
  function renderDay(i) {
    if (!Number.isInteger(i) || i < 0 || i >= days.length) return;
    selected = i;
    const lane = week.querySelector('.vb-calendar-lane[data-day="' + i + '"]');
    const dayhead = week.querySelector('.vb-calendar-dayhead[data-day="' + i + '"]');
    const events = lane ? [...lane.querySelectorAll(".vb-calendar-event")] : [];
    const milestones = dayhead ? [...dayhead.querySelectorAll(".vb-calendar-allday")] : [];

    summary.textContent = labels[i] + ", " + (i + 12) + "/10/2026";
    count.textContent = events.length + " khung thời gian được lên lịch" +
      (milestones.length ? " · " + milestones.length + " sự kiện cả ngày" : "");
    panel.querySelector("[data-vb-day-prev]").disabled = i === 0;
    panel.querySelector("[data-vb-day-next]").disabled = i === 6;
    const rows = [];

    milestones.forEach(marker => {
      const item = document.createElement("li");
      item.className = "vb-agenda-milestone";
      const time = document.createElement("span");
      time.textContent = "CẢ NGÀY";
      const name = document.createElement("span");
      name.textContent = marker.textContent;
      item.append(time, name);
      rows.push(item);
    });
    events.forEach(entry => {
      const row = document.createElement("li");
      const category = [...entry.classList].find(cls => cls.startsWith("cat-")) || "cat-rest";
      row.className = "vb-agenda-event " + category;
      const time = document.createElement("span");
      time.className = "vb-agenda-time";
      time.textContent = entry.querySelector("small")?.textContent || "";
      const activity = document.createElement("span");
      activity.className = "vb-agenda-activity";
      activity.textContent = entry.querySelector("strong")?.textContent || "";
      row.append(time, activity);
      rows.push(row);
    });
    agenda.replaceChildren(...rows);
  }

  function chooseDay(i, focus = false) {
    if (i < 0 || i >= days.length) return;
    // Keep the original calendar's selected day and scrolling behavior intact.
    days[i].click();
    if (focus) days[i].focus({ preventScroll: true });
  }

  dayNav.addEventListener("click", event => {
    const button = event.target.closest("[data-vb-day]");
    if (button && dayNav.contains(button)) renderDay(Number(button.dataset.vbDay));
  });
  dayNav.addEventListener("keydown", event => {
    const button = event.target.closest("[data-vb-day]");
    if (!button) return;
    const index = Number(button.dataset.vbDay);
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % days.length;
    else if (event.key === "ArrowLeft") next = (index + days.length - 1) % days.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = 6;
    else return;
    event.preventDefault();
    chooseDay(next, true);
  });
  panel.querySelector("[data-vb-day-prev]").addEventListener("click", () => chooseDay(selected - 1));
  panel.querySelector("[data-vb-day-next]").addEventListener("click", () => chooseDay(selected + 1));
  modeButtons.forEach(button => button.addEventListener("click", () => setMode(button.dataset.vbCalMode)));

  renderDay(0);
  setMode(mode);
})();