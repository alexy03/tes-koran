let correctAnswers = 0;
let wrongAnswers = 0;
let totalTimeSelected = 0;
let timeRemaining = 0;
let currentQuestion = {};
let segmentData = { times: [], correct: [], wrong: [] };
const segmentTime = 15;
let nextSegment = segmentTime;
let timer, countdownTimer, quizStartTime;

let lang = 'id'; // default bahasa Indonesia

const texts = {
  id: {
    title: "Tes Koran",
    chooseTime: "Pilih Waktu",
    prep: "Persiapan...",
    result: "Hasil Tes",
    correct: "Total Benar",
    wrong: "Total Salah",
    totalTime: "Total Waktu",
    perSegment: "Waktu Per Segment: 15 Detik",
    retry: "Ulangi Tes",
    seconds: "detik",
    timerLabel: "Waktu Pengerjaan (detik)",
    scoreLabel: "Total Benar/Salah"
  },
  en: {
    title: "Newspaper Test",
    chooseTime: "Choose Time",
    prep: "Get Ready...",
    result: "Test Result",
    correct: "Total Correct",
    wrong: "Total Wrong",
    totalTime: "Total Time",
    perSegment: "Time Per Segment: 15 Seconds",
    retry: "Retry Test",
    seconds: "seconds",
    timerLabel: "Time (seconds)",
    scoreLabel: "Score"
  }
};

function updateLanguage() {
  document.getElementById("page-title").innerText = texts[lang].title;
  document.getElementById("choose-time-label").innerText = texts[lang].chooseTime;
  document.getElementById("prep-label").innerText = texts[lang].prep;
  document.getElementById("result-label").innerText = texts[lang].result;
  document.getElementById("correct-count-label").innerText = texts[lang].correct;
  document.getElementById("wrong-count-label").innerText = texts[lang].wrong;
  document.getElementById("total-time-label").innerText = texts[lang].totalTime;
  document.getElementById("per-segment-label").innerText = texts[lang].perSegment;
  document.getElementById("retry-btn").innerText = texts[lang].retry;
}

document.getElementById("lang-switch").addEventListener("click", () => {
  lang = lang === 'id' ? 'en' : 'id';
  document.getElementById("lang-switch").innerText = lang.toUpperCase();
  updateLanguage();
});

function startCountdown(duration) {
  totalTimeSelected = duration;
  timeRemaining = duration;
  document.getElementById("layer1").classList.add("hidden");
  document.getElementById("countdown-container").classList.remove("hidden");

  let count = 3;
  document.getElementById("countdown").innerText = count;
  countdownTimer = setInterval(() => {
    count--;
    document.getElementById("countdown").innerText = count;
    if (count === 0) {
      clearInterval(countdownTimer);
      document.getElementById("countdown-container").classList.add("hidden");
      document.getElementById("quiz-container").classList.remove("hidden");
      startQuiz();
    }
  }, 1000);
}

function startQuiz() {
  quizStartTime = Date.now();
  nextSegment = segmentTime;
  correctAnswers = 0;
  wrongAnswers = 0;
  segmentData = { times: [], correct: [], wrong: [] };
  generateQuestion();

  timer = setInterval(() => {
    let elapsed = Math.floor((Date.now() - quizStartTime) / 1000);
    timeRemaining = totalTimeSelected - elapsed;
    updateTimer();

    if (elapsed >= nextSegment) {
      segmentData.times.push(nextSegment);
      segmentData.correct.push(correctAnswers);
      segmentData.wrong.push(wrongAnswers);
      nextSegment += segmentTime;
    }

    if (timeRemaining <= 0) {
      clearInterval(timer);
      endQuiz();
    }
  }, 1000);
}

function updateTimer() {
  let minutes = Math.floor(timeRemaining / 60);
  let seconds = timeRemaining % 60;
  document.getElementById("time-left").innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function generateQuestion() {
  let num1 = Math.floor(Math.random() * 10);
  let num2 = Math.floor(Math.random() * 10);
  currentQuestion = { num1, num2, correctAnswer: (num1 + num2) % 10 };
  document.getElementById("question").innerText = `${num1} + ${num2} = ?`;
}

function submitAnswer(userAnswer) {
  if (userAnswer === currentQuestion.correctAnswer) {
    correctAnswers++;
  } else {
    wrongAnswers++;
  }
  generateQuestion();
}

function endQuiz() {
  document.getElementById("quiz-container").classList.add("hidden");
  document.getElementById("result-container").classList.remove("hidden");
  document.getElementById("correct-count").innerText = correctAnswers;
  document.getElementById("wrong-count").innerText = wrongAnswers;
  document.getElementById("total-time").innerText = totalTimeSelected;

  let ctx = document.getElementById("resultChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: segmentData.times.map(t => `${t} ${texts[lang].seconds}`),
      datasets: [
        { label: texts[lang].correct, data: segmentData.correct, borderColor: "green", fill: false },
        { label: texts[lang].wrong, data: segmentData.wrong, borderColor: "red", fill: false }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: texts[lang].timerLabel } },
        y: { title: { display: true, text: texts[lang].scoreLabel }, beginAtZero: true }
      }
    }
  });
}

function restartTest() {
  document.getElementById("result-container").classList.add("hidden");
  document.getElementById("layer1").classList.remove("hidden");
  updateLanguage();
}
