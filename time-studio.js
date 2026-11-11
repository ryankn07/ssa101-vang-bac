/* VÀNG BẠC — Time Studio: Time Audit + Time Blocking.
   Vanilla JavaScript only. User data stays in this browser. */
(() => {
  "use strict";

  const root = document.querySelector("[data-vb-studio]");
  if (!root) return;

  const STORAGE_KEY = "vangbac-time-studio-v1";
  const auditDefaults = {
    sleep: 8,
    school: 6,
    self: 3,
    meals: 2,
    commute: 1,
    leisure: 4
  };
  const auditItems = [
    { key: "sleep", label: "Ngủ nghỉ", color: "#ef7254" },
    { key: "school", label: "Học trên trường", color: "#183b4b" },
    { key: "self", label: "Tự học", color: "#718d91" },
    { key: "meals", label: "Ăn uống & sinh hoạt", color: "#d7a45f" },
    { key: "commute", label: "Di chuyển", color: "#9aabb0" },
    { key: "leisure", label: "Giải trí & nghỉ ngơi", color: "#c5a995" }
  ];
  const categoryLabels = {
    school: "Học trên trường",
    self: "Tự học",
    assignment: "Bài tập",
    personal: "Sinh hoạt"
  };
  const sampleTasks = [
    { id: "sample-1", title: "Học trên trường", start: "08:00", duration: 2, category: "school", sample: true },
    { id: "sample-2", title: "Làm bài tập", start: "10:30", duration: 1, category: "assignment", sample: true },
    { id: "sample-3", title: "Tự học", start: "14:00", duration: 1.5, category: "self", sample: true }
  ];

  function readSavedState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  const saved = readSavedState();
  let audit = { ...auditDefaults };
  auditItems.forEach(item => {
    const value = Number(saved && saved.audit ? saved.audit[item.key] : auditDefaults[item.key]);
    if (Number.isFinite(value) && value >= 0 && value <= 24) audit[item.key] = value;
  });
  let tasks = saved && Array.isArray(saved.tasks)
    ? saved.tasks.filter(task =>
        task &&
        typeof task.id === "string" &&
        typeof task.title === "string" &&
        /^\\d{2}:\\d{2}$/.test(task.start) &&
        Number.isFinite(Number(task.duration)) &&
        Number(task.duration) > 0 &&
        Boolean(categoryLabels[task.category])
      )
    : sampleTasks.slice();
  let idCounter = 0;

  const auditInputs = [...root.querySelectorAll("[data-audit-input]")];
  const chart = root.querySelector("[data-audit-chart]");
  const auditTotal = root.querySelector("[data-audit-total]");
  const auditSummary = root.querySelector("[data-audit-summary]");
  const saveStatus = root.querySelector("[data-studio-save-status]");
  const taskForm = root.querySelector("[data-studio-task-form]");
  const taskList = root.querySelector("[data-studio-task-list]");
  const taskStatus = root.querySelector("[data-task-status]");
  const taskSummary = root.querySelector("[data-task-summary]");
  const taskTitle = root.querySelector("[data-task-title]");
  const taskStart = root.querySelector("[data-task-start]");
  const taskDuration = root.querySelector("[data-task-duration]");

  function formatNumber(value) {
    return Number(value).toLocaleString("vi-VN", { maximumFractionDigits: 2 });
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ audit, tasks }));
      if (saveStatus) saveStatus.textContent = "Đã lưu trên thiết bị này";
    } catch {
      if (saveStatus) saveStatus.textContent = "Không thể lưu tự động trên trình duyệt này";
    }
  }

  function renderAudit() {
    const total = auditItems.reduce((sum, item) => sum + Math.max(0, Number(audit[item.key]) || 0), 0);
    const remaining = 24 - total;
    let cursor = 0;
    const stops = [];

    auditItems.forEach(item => {
      const value = Math.max(0, Number(audit[item.key]) || 0);
      if (value <= 0) return;
      const start = cursor;
      cursor += (value / Math.max(total, 24)) * 360;
      stops.push(item.color + " " + start.toFixed(2) + "deg " + cursor.toFixed(2) + "deg");
    });
    if (remaining > 0) {
      stops.push("#e7e2d8 " + cursor.toFixed(2) + "deg 360deg");
    }
    if (chart) {
      chart.style.background = "conic-gradient(" + (stops.length ? stops.join(",") : "#e7e2d8 0deg 360deg") + ")";
      chart.setAttribute("aria-label", "Đã phân bổ " + formatNumber(total) + " trên 24 giờ");
    }
    if (auditTotal) auditTotal.textContent = formatNumber(total);
    auditInputs.forEach(input => {
      const key = input.dataset.auditInput;
      if (document.activeElement !== input) input.value = audit[key] ?? 0;
    });

    if (remaining > 0) {
      auditSummary.textContent = "Bạn còn " + formatNumber(remaining) + " giờ chưa phân bổ. Hãy xem đó là thời gian dự phòng hay một khoảng đang bị bỏ quên.";
    } else if (remaining < 0) {
      auditSummary.textContent = "Bạn đang phân bổ vượt " + formatNumber(Math.abs(remaining)) + " giờ. Hãy giảm bớt để kế hoạch trở về giới hạn 24 giờ.";
    } else {
      auditSummary.textContent = "Bạn đã phân bổ đủ 24 giờ. Hãy kiểm tra xem thời gian nghỉ và tự học có cân bằng với lịch thực tế không.";
    }
  }

  auditInputs.forEach(input => {
    input.addEventListener("input", () => {
      const key = input.dataset.auditInput;
      audit[key] = Math.max(0, Math.min(24, Number(input.value) || 0));
      renderAudit();
      persist();
    });
    input.addEventListener("change", () => {
      input.value = String(audit[input.dataset.auditInput]);
    });
  });

  root.querySelector("[data-audit-reset]")?.addEventListener("click", () => {
    audit = { ...auditDefaults };
    renderAudit();
    persist();
  });

  function minutesFromTime(value) {
    const parts = String(value || "").split(":").map(Number);
    return parts.length === 2 ? parts[0] * 60 + parts[1] : NaN;
  }

  function timeFromMinutes(value) {
    const safe = Math.max(0, Math.min(1440, value));
    const hours = Math.floor(safe / 60);
    const minutes = safe % 60;
    return String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0");
  }

  function renderTasks() {
    if (!taskList) return;
    taskList.replaceChildren();
    const sorted = [...tasks].sort((a, b) => minutesFromTime(a.start) - minutesFromTime(b.start));
    const totalHours = sorted.reduce((sum, task) => sum + Number(task.duration || 0), 0);

    if (taskSummary) {
      taskSummary.textContent = sorted.length + " công việc · " + formatNumber(totalHours) + " giờ đã lên lịch";
    }

    if (!sorted.length) {
      const empty = document.createElement("p");
      empty.className = "vb-studio-empty";
      empty.textContent = "Chưa có công việc nào. Thêm một việc để bắt đầu xây dựng lịch.";
      taskList.append(empty);
      return;
    }

    sorted.forEach(task => {
      const item = document.createElement("article");
      item.className = "vb-studio-task vb-studio-task--" + (categoryLabels[task.category] ? task.category : "personal");

      const time = document.createElement("div");
      time.className = "vb-studio-task-time";
      const start = minutesFromTime(task.start);
      const end = start + Number(task.duration) * 60;
      const startLabel = document.createElement("strong");
      startLabel.textContent = task.start;
      const endLabel = document.createElement("span");
      endLabel.textContent = timeFromMinutes(end);
      time.append(startLabel, endLabel);

      const copy = document.createElement("div");
      copy.className = "vb-studio-task-copy";
      const name = document.createElement("strong");
      name.textContent = task.title;
      const meta = document.createElement("small");
      meta.textContent = (categoryLabels[task.category] || "Sinh hoạt") + " · " + formatNumber(task.duration) + " giờ";
      copy.append(name, meta);
      if (task.sample) {
        const sample = document.createElement("span");
        sample.className = "vb-studio-sample";
        sample.textContent = "MẪU";
        copy.append(sample);
      }

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "vb-studio-task-remove";
      remove.textContent = "×";
      remove.setAttribute("aria-label", "Xóa công việc " + task.title);
      remove.addEventListener("click", () => {
        tasks = tasks.filter(entry => entry.id !== task.id);
        taskStatus.textContent = "Đã xóa công việc.";
        renderTasks();
        persist();
      });

      item.append(time, copy, remove);
      taskList.append(item);
    });
  }

  taskForm?.addEventListener("submit", event => {
    event.preventDefault();
    const title = taskTitle.value.trim();
    const start = taskStart.value;
    const duration = Number(taskDuration.value);
    const category = root.querySelector("[data-task-category]").value;
    const startMinutes = minutesFromTime(start);
    const endMinutes = startMinutes + duration * 60;

    if (!title) {
      taskStatus.textContent = "Hãy nhập tên công việc.";
      taskTitle.focus();
      return;
    }
    if (!Number.isFinite(startMinutes) || !Number.isFinite(duration) || duration <= 0 || endMinutes > 1440) {
      taskStatus.textContent = "Thời gian chưa hợp lệ. Công việc cần kết thúc trước 24:00.";
      return;
    }

    const conflict = tasks.find(task => {
      const existingStart = minutesFromTime(task.start);
      const existingEnd = existingStart + Number(task.duration) * 60;
      return startMinutes < existingEnd && endMinutes > existingStart;
    });
    if (conflict) {
      taskStatus.textContent = "Bị trùng với “" + conflict.title + "” (" + conflict.start + "–" + timeFromMinutes(minutesFromTime(conflict.start) + conflict.duration * 60) + "). Hãy chọn khung giờ khác.";
      return;
    }

    idCounter += 1;
    tasks.push({
      id: "task-" + Date.now() + "-" + idCounter,
      title,
      start,
      duration,
      category,
      sample: false
    });
    taskTitle.value = "";
    taskTitle.focus();
    taskStatus.textContent = "Đã thêm công việc vào lịch.";
    renderTasks();
    persist();
  });

  root.querySelector("[data-task-clear]")?.addEventListener("click", () => {
    tasks = [];
    taskStatus.textContent = "Đã xóa toàn bộ lịch trên thiết bị này.";
    renderTasks();
    persist();
  });

  const tabs = [...root.querySelectorAll("[data-studio-tab]")];
  const panels = [...root.querySelectorAll("[data-studio-panel]")];

  function setTab(name, focus = false) {
    tabs.forEach(tab => {
      const active = tab.dataset.studioTab === name;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      if (focus && active) tab.focus();
    });
    panels.forEach(panel => {
      const active = panel.dataset.studioPanel === name;
      panel.hidden = !active;
      panel.setAttribute("aria-hidden", String(!active));
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => setTab(tab.dataset.studioTab));
    tab.addEventListener("keydown", event => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const next = (index + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
      setTab(tabs[next].dataset.studioTab, true);
    });
  });

  renderAudit();
  renderTasks();
  persist();
})();
