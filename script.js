const socket = new WebSocket("ws://localhost:8080/status");

let liveTimerInterval = null;
let lastGameTime = 0;
let lastTimestamp = null;
let currentSplitIndex = -1;

function insertIntoElement(id, data) {
  const el = document.getElementById(id);
  if (el) el.textContent = data;
}

function clearHighlight() {
  for (let i = 1; i <= 10; i++) {
    const el = document.getElementById(`splits-${i}`);
    if (el) el.classList.remove("highlight");
  }
}

function startLiveTimer() {
  if (liveTimerInterval) clearInterval(liveTimerInterval);
  liveTimerInterval = setInterval(() => {
    if (lastTimestamp !== null && currentSplitIndex >= 0) {
      const elapsed = (Date.now() - lastTimestamp) / 1000;
      const liveTime = lastGameTime + elapsed;
      insertIntoElement("timer", liveTime.toFixed(3));
      insertIntoElement(`splits-${currentSplitIndex + 1}`, liveTime.toFixed(3));
    }
  }, 100);
}

function stopLiveTimer() {
  if (liveTimerInterval) {
    clearInterval(liveTimerInterval);
    liveTimerInterval = null;
  }
}

function parse(event) {
  let data = JSON.parse(event.data);
  const splits = data.splits || [];

  clearHighlight();

  for (let i = 0; i < 10; i++) {
    const val = splits[i] !== undefined ? splits[i].toFixed(3) : "0.000";
    insertIntoElement(`splits-${i + 1}`, val);
  }

  if (Array.isArray(splits) && data.isRunActive) {
    currentSplitIndex = splits.length;
    if (currentSplitIndex < 10) {
      const el = document.getElementById(`splits-${currentSplitIndex + 1}`);
      if (el) el.classList.add("highlight");
      lastGameTime = data.gameTimer;
      lastTimestamp = Date.now();
      startLiveTimer();
    } else {
      stopLiveTimer();
    }
  } else {
    stopLiveTimer();
  }

  insertIntoElement("timer", data.gameTimer.toFixed(3));
}

socket.onopen = () => {
  console.log("WebSocket connected");
};

socket.onmessage = (event) => {
  parse(event);
};

socket.onclose = () => {
  console.log("WebSocket closed");
};
