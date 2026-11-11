/* Vàng Bạc — Pomodoro timer + Eisenhower practice. No data is stored. */
(() => {
  "use strict";
  const root = document.querySelector("[data-vb-interactive-lab]");
  if (!root) return;
  const one = selector => root.querySelector(selector);
  const tabs = [...root.querySelectorAll("[data-vb-lab-tab]")];
  const panels = [...root.querySelectorAll("[data-vb-lab-panel]")];

  function selectPanel(id, focus = false) {
    tabs.forEach(tab => {
      const active = tab.dataset.vbLabTab === id;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    });
    panels.forEach(panel => {
      const active = panel.id === id;
      panel.hidden = !active;
      panel.setAttribute("aria-hidden", String(!active));
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectPanel(tab.dataset.vbLabTab));
    tab.addEventListener("keydown", event => {
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      else return;
      event.preventDefault();
      selectPanel(tabs[next].dataset.vbLabTab, true);
    });
  });

  /* Pomodoro: a real countdown, paused automatically when the tab is hidden. */
  const durations = { focus: 25 * 60, break: 5 * 60 };
  const modeNames = { focus: "TẬP TRUNG", break: "NGHỈ NGẮN" };
  const ring = one("[data-pomo-ring]");
  const timeNode = one("[data-pomo-time]");
  const modeNode = one("[data-pomo-mode-label]");
  const statusNode = one("[data-pomo-status]");
  const toggleButton = one("[data-pomo-toggle]");
  const modeButtons = [...root.querySelectorAll("[data-pomo-mode]")];
  const resetButton = one("[data-pomo-reset]");
  let mode = "focus";
  let remaining = durations[mode];
  let timer = null;

  function formatTime(seconds) {
    return String(Math.floor(seconds / 60)).padStart(2, "0") + ":" +
      String(seconds % 60).padStart(2, "0");
  }
  function renderTimer() {
    const ratio = Math.max(0, Math.min(1, remaining / durations[mode]));
    ring.style.setProperty("--pomo-progress", (ratio * 100) + "%");
    timeNode.textContent = formatTime(remaining);
    modeNode.textContent = modeNames[mode];
    ring.setAttribute("aria-label", modeNames[mode] + ": " + formatTime(remaining));
    toggleButton.textContent = timer ? "TẠM DỪNG" :
      remaining === durations[mode] ? "BẮT ĐẦU" :
      remaining === 0 ? "BẮT ĐẦU LẠI" : "TIẾP TỤC";
    modeButtons.forEach(button =>
      button.setAttribute("aria-pressed", String(button.dataset.pomoMode === mode))
    );
  }
  function pauseTimer() {
    if (timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
    renderTimer();
  }
  function startTimer() {
    if (timer !== null) {
      pauseTimer();
      statusNode.textContent = "Đã tạm dừng. Bạn có thể tiếp tục bất cứ lúc nào.";
      return;
    }
    if (remaining <= 0) remaining = durations[mode];
    timer = window.setInterval(() => {
      remaining = Math.max(0, remaining - 1);
      if (remaining === 0) {
        pauseTimer();
        statusNode.textContent = mode === "focus"
          ? "Phiên tập trung đã kết thúc. Hãy chuyển sang nghỉ ngắn."
          : "Phiên nghỉ đã kết thúc. Bạn có thể bắt đầu phiên tập trung mới.";
        return;
      }
      renderTimer();
    }, 1000);
    statusNode.textContent = mode === "focus"
      ? "Đang tập trung. Hạn chế chuyển sang việc khác trong phiên này."
      : "Đang nghỉ ngắn. Tạm rời màn hình nếu có thể.";
    renderTimer();
  }
  toggleButton.addEventListener("click", startTimer);
  resetButton.addEventListener("click", () => {
    pauseTimer();
    remaining = durations[mode];
    statusNode.textContent = "Bộ đếm đã được đặt lại.";
    renderTimer();
  });
  modeButtons.forEach(button => {
    button.addEventListener("click", () => {
      pauseTimer();
      mode = button.dataset.pomoMode === "break" ? "break" : "focus";
      remaining = durations[mode];
      statusNode.textContent = mode === "focus"
        ? "Sẵn sàng cho một phiên tập trung 25 phút."
        : "Sẵn sàng cho một khoảng nghỉ 5 phút.";
      renderTimer();
    });
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && timer !== null) {
      pauseTimer();
      statusNode.textContent = "Đã tự tạm dừng khi bạn rời trang.";
    }
  });
  renderTimer();

  /* Eisenhower exercise: four short scenarios with immediate feedback. */
  const tasks = [
    {
      task: "Bài tập phải nộp trước 23:59 hôm nay.",
      context: "Deadline chỉ còn vài giờ và bạn cần trực tiếp hoàn thành bài.",
      answer: "do",
      explanation: "Việc quan trọng và có hạn rất gần — nên ưu tiên xử lý ngay."
    },
    {
      task: "Ôn tập cho bài kiểm tra còn 7 ngày.",
      context: "Đây là mục tiêu học tập quan trọng, nhưng vẫn còn thời gian để chia nhỏ.",
      answer: "schedule",
      explanation: "Việc quan trọng nhưng chưa khẩn cấp — hãy lên lịch và chia thành các phiên ôn tập."
    },
    {
      task: "Một việc phụ cần phản hồi trong 10 phút, có thể nhờ người khác xử lý.",
      context: "Cần phản hồi sớm, nhưng không nhất thiết bạn phải trực tiếp làm việc đó.",
      answer: "delegate",
      explanation: "Việc khẩn cấp nhưng ít quan trọng với ưu tiên chính — cân nhắc giao lại hoặc nhờ hỗ trợ."
    },
    {
      task: "Lướt video ngắn trong lúc đang học, không có mục tiêu cụ thể.",
      context: "Không có hạn cần xử lý và việc này đang làm gián đoạn thời gian tập trung.",
      answer: "eliminate",
      explanation: "Việc không quan trọng và không khẩn cấp — nên loại bỏ khỏi phiên tập trung."
    }
  ];
  const taskNode = one("[data-matrix-task]");
  const contextNode = one("[data-matrix-context]");
  const countNode = one("[data-matrix-count]");
  const scoreNode = one("[data-matrix-score]");
  const feedbackNode = one("[data-matrix-feedback]");
  const progressNode = one("[data-matrix-progress]");
  const nextButton = one("[data-matrix-next]");
  const choices = [...root.querySelectorAll("[data-matrix-answer]")];
  let taskIndex = 0;
  let score = 0;
  let answered = false;
  let complete = false;

  function renderTask() {
    choices.forEach(button => {
      button.disabled = complete;
      button.classList.remove("is-correct", "is-wrong");
    });
    nextButton.hidden = true;
    if (complete) {
      countNode.textContent = "HOÀN TẤT / 04";
      taskNode.textContent = "Bạn đã hoàn thành 4 tình huống.";
      contextNode.textContent = "Hãy xem lại cách phân loại và thử áp dụng với công việc thực tế của bạn.";
      feedbackNode.textContent = "Kết quả của lượt này: " + score + "/4 câu đúng. Đây là bài luyện tập minh họa, không phải bài đánh giá năng lực.";
      progressNode.style.width = "100%";
      scoreNode.textContent = "KẾT QUẢ " + score + " / 04";
      nextButton.textContent = "LÀM LẠI ↻";
      nextButton.hidden = false;
      return;
    }
    const item = tasks[taskIndex];
    countNode.textContent = String(taskIndex + 1).padStart(2, "0") + " / 04";
    taskNode.textContent = item.task;
    contextNode.textContent = item.context;
    feedbackNode.textContent = "Chọn một nhóm bên phải để phân loại tình huống này.";
    progressNode.style.width = ((taskIndex / tasks.length) * 100) + "%";
    scoreNode.textContent = "ĐÚNG " + score + " / 04";
  }
  choices.forEach(button => {
    button.addEventListener("click", () => {
      if (answered || complete) return;
      answered = true;
      const item = tasks[taskIndex];
      const chosen = button.dataset.matrixAnswer;
      const correct = chosen === item.answer;
      if (correct) score += 1;
      choices.forEach(choice => {
        choice.disabled = true;
        if (choice.dataset.matrixAnswer === item.answer) choice.classList.add("is-correct");
      });
      if (!correct) button.classList.add("is-wrong");
      feedbackNode.textContent = (correct ? "Chính xác. " : "Chưa đúng. ") + item.explanation;
      scoreNode.textContent = "ĐÚNG " + score + " / 04";
      progressNode.style.width = (((taskIndex + 1) / tasks.length) * 100) + "%";
      nextButton.textContent = taskIndex === tasks.length - 1 ? "XEM KẾT QUẢ ↗" : "CÂU TIẾP THEO ↗";
      nextButton.hidden = false;
    });
  });
  nextButton.addEventListener("click", () => {
    if (complete) {
      taskIndex = 0;
      score = 0;
      answered = false;
      complete = false;
      renderTask();
      return;
    }
    if (!answered) return;
    if (taskIndex >= tasks.length - 1) {
      complete = true;
    } else {
      taskIndex += 1;
      answered = false;
    }
    renderTask();
  });
  renderTask();
})();