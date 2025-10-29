// FINAL script.js — versi lengkap (dashboard di akhir video, full-screen safe, anti-skip hybrid)
// Pastikan file berikut berada di folder yang sama:
// - Produk kelompok 8_Sistem Pencernaan Manusia.mp4
// - successed-295058.mp3
// - wrong-buzzer-6268.mp3
// - applause-236785.mp3

// ==================== ELEMENTS ====================
const VIDEO = document.getElementById('quizVideo');
const START_SCREEN = document.getElementById('startScreen');
const START_BTN = document.getElementById('startBtn');
const NAME_INPUT = document.getElementById('playerName');

const QUIZ_OVERLAY = document.getElementById('quizOverlay');
const QUESTION_TEXT = document.getElementById('questionText');
const OPTIONS_WRAPPER = document.getElementById('options');
const SUBMIT_BTN = document.getElementById('submitAnswer');
const CONTINUE_BTN = document.getElementById('continueVideo');
const LIVE_SCORE = document.getElementById('liveScore');

const FEEDBACK_OVERLAY = document.getElementById('bigFeedback');
const FEEDBACK_BOX = document.getElementById('feedbackBox');

const SCOREBOARD = document.getElementById('scoreboard');
const FINAL_SCORE_TEXT = document.getElementById('finalScoreText');
const LEADERBOARD = document.getElementById('leaderboard');
const PLAY_AGAIN = document.getElementById('playAgain');
const RESET_SCORES = document.getElementById('resetScores');

const SOUND_CORRECT = document.getElementById('soundCorrect');
const SOUND_WRONG = document.getElementById('soundWrong');
const SOUND_APPLAUSE = document.getElementById('soundApplause');

const LS_KEY = 'videoQuizLeaderboard_v1';

// ==================== QUESTION DATA ====================
const QUESTIONS = [
  { time: 82, text: "Berikut yang bukan termasuk fungsi rongga mulut dalam sistem pencernaan adalah...", options: ["A. Tempat pencernaan mekanis","B. Tempat pencernaan kimiawi awal","C. Tempat penyerapan sari-sari makanan","D. Tempat pembentukan bolus"], correct: 2 },
  { time: 145, text: "Apa nama enzim yang berfungsi untuk memecah karbohidrat dalam rongga mulut?", options: ["A. Amilase","B. Lipase","C. Pepsin","D. Tripsin"], correct: 0 },
  { time: 181, text: "Apa fungsi utama kerongkongan dalam sistem pencernaan?", options: ["A. Mengangkut makanan dari rongga mulut ke lambung","B. Menghasilkan enzim pencernaan","C. Menyerap sari-sari makanan","D. Mengatur kadar air dan elektrolit dalam feses"], correct: 0 },
  { time: 214, text: "Asam lambung (HCl) memiliki fungsi utama yaitu...", options: ["A. Mengubah amilum menjadi maltosa","B. Membunuh mikroorganisme dan mengaktifkan pepsin","C. Menetralisir asam dari usus","D. Mengubah lemak menjadi asam lemak"], correct: 1 },
  { time: 261, text: "Apa nama enzim yang berfungsi untuk memecah protein dalam lambung?", options: ["A. Amilase","B. Lipase","C. Pepsin","D. Tripsin"], correct: 2 },
  { time: 327, text: "Permukaan dinding usus halus memiliki jonjot (vili) berfungsi untuk...", options: ["A. Menyimpan lemak","B. Menyerap sari sari makanan","C. Menghasilkan enzim pepsin","D. Mengubah makanan menjadi feses"], correct: 1 },
  { time: 357, text: "Apa fungsi utama usus besar dalam sistem pencernaan?", options: ["A. Menghasilkan enzim pencernaan","B. Menyerap sari-sari makanan","C. Mengatur kadar air dan elektrolit dalam feses","D. Mengangkut makanan dari usus halus ke anus"], correct: 2 },
  { time: 389, text: "Apa fungsi utama anus dalam sistem pencernaan?", options: ["A. Mengangkut makanan dari usus besar ke luar tubuh","B. Menghasilkan enzim pencernaan","C. Menyerap sari-sari makanan","D. Mengatur kadar air dan elektrolit dalam feses"], correct: 0 },
  { time: 419, text: "Fungsi utama hati dalam sistem pencernaan adalah...", options: ["A. Menghasilkan enzim amilase","B. Menghasilkan getah empedu","C. Menghasilkan hormon insulin","D. Menghasilkan enzim tripsin"], correct: 1 },
  { time: 467, text: "Apa fungsi utama pankreas dalam sistem pencernaan?", options: ["A. Menghasilkan enzim amilase","B. Menghasilkan getah empedu","C. Menghasilkan hormon insulin","D. Menghasilkan enzim pencernaan"], correct: 3 }
];

// ==================== STATE VARIABEL ====================
let playerName = '';
let score = 0;
let selectedOption = null;
let pendingQuestionIndex = -1;
let answered = new Array(QUESTIONS.length).fill(false);

// ==================== FULLSCREEN HANDLER ====================
function attachOverlay(elem){
  const fs = document.fullscreenElement;
  const attachTo = fs || document.body;
  if (elem.parentElement !== attachTo) attachTo.appendChild(elem);
  if (fs){
    elem.style.position = 'absolute';
    elem.style.top = '0';
    elem.style.left = '0';
    elem.style.width = '100%';
    elem.style.height = '100%';
  } else {
    elem.style.position = '';
    elem.style.width = '';
    elem.style.height = '';
  }
}

document.addEventListener('fullscreenchange', () => {
  attachOverlay(QUIZ_OVERLAY);
  attachOverlay(FEEDBACK_OVERLAY);
  attachOverlay(SCOREBOARD);
});

// ==================== START QUIZ ====================
START_BTN.addEventListener('click', () => {
  const name = NAME_INPUT.value.trim();
  if (!name) { NAME_INPUT.focus(); return; }
  playerName = name;
  START_SCREEN.style.display = 'none';
  score = 0;
  answered.fill(false);
  selectedOption = null;
  updateLiveScore();

  attachOverlay(QUIZ_OVERLAY);
  attachOverlay(FEEDBACK_OVERLAY);
  attachOverlay(SCOREBOARD);
  VIDEO.play().catch(()=>{});
});

// ==================== TAMPILKAN PERTANYAAN ====================
function showQuestion(index){
  pendingQuestionIndex = index;
  const q = QUESTIONS[index];
  QUESTION_TEXT.textContent = q.text;
  OPTIONS_WRAPPER.innerHTML = '';
  selectedOption = null;

  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => {
      selectedOption = i;
      Array.from(OPTIONS_WRAPPER.children).forEach(x => x.classList.remove('selected'));
      btn.classList.add('selected');
    });
    OPTIONS_WRAPPER.appendChild(btn);
  });

  attachOverlay(QUIZ_OVERLAY);
  QUIZ_OVERLAY.classList.add('active');
  SUBMIT_BTN.style.display = 'inline-block';
  CONTINUE_BTN.style.display = 'none';
}

// ==================== KETIKA SUBMIT JAWABAN ====================
SUBMIT_BTN.addEventListener('click', () => {
  if (selectedOption === null){
    flashFeedback('Pilih jawaban terlebih dahulu', 'neutral', 800);
    return;
  }
  const q = QUESTIONS[pendingQuestionIndex];
  answered[pendingQuestionIndex] = true;

  if (selectedOption === q.correct){
    score++;
    updateLiveScore();
    SOUND_CORRECT.currentTime = 0;
    SOUND_CORRECT.play();
    flashFeedback('✅ Benar!', 'success', 1000);
  } else {
    SOUND_WRONG.currentTime = 0;
    SOUND_WRONG.play();
    flashFeedback(`❌ Salah! Jawaban benar: ${q.options[q.correct]}`, 'wrong', 1500);
  }

  setTimeout(() => {
    SUBMIT_BTN.style.display = 'none';
    CONTINUE_BTN.style.display = 'inline-block';
  }, 600);
});

// ==================== LANJUTKAN VIDEO ====================
CONTINUE_BTN.addEventListener('click', () => {
  QUIZ_OVERLAY.classList.remove('active');
  CONTINUE_BTN.style.display = 'none';
  VIDEO.play();
});

// ==================== FEEDBACK ANIMASI ====================
function flashFeedback(text, type='success', duration=1200){
  FEEDBACK_BOX.innerText = text;
  FEEDBACK_BOX.className = 'feedback-box ' + type;
  attachOverlay(FEEDBACK_OVERLAY);
  FEEDBACK_OVERLAY.classList.add('show');
  setTimeout(() => {
    FEEDBACK_OVERLAY.classList.remove('show');
  }, duration);
}

function updateLiveScore(){ LIVE_SCORE.textContent = score; }

// ==================== LOOP CEK WAKTU ====================
const TOL = 0.6;
setInterval(() => {
  if (VIDEO.paused) return;
  const t = VIDEO.currentTime;
  for (let i=0;i<QUESTIONS.length;i++){
    if (!answered[i] && QUESTIONS[i].time <= t + TOL){
      VIDEO.pause();
      showQuestion(i);
      return;
    }
  }
}, 220);

// ==================== SCOREBOARD & LEADERBOARD ====================
function showScoreboardAndSave(){
  SOUND_APPLAUSE.currentTime = 0;
  SOUND_APPLAUSE.play();
  const entry = { name: playerName, score, time: new Date().toISOString() };
  const arr = readLeaderboard();
  arr.push(entry);
  arr.sort((a,b)=> b.score - a.score || new Date(b.time) - new Date(a.time));
  localStorage.setItem(LS_KEY, JSON.stringify(arr));
  populateLeaderboardUI(arr);

  attachOverlay(SCOREBOARD);
  SCOREBOARD.classList.add('active');
  FINAL_SCORE_TEXT.textContent = `${playerName}, skor Anda: ${score} / ${QUESTIONS.length}`;
}

function readLeaderboard(){ try{ return JSON.parse(localStorage.getItem(LS_KEY) || '[]') }catch(e){return []} }
function populateLeaderboardUI(arr){
  LEADERBOARD.innerHTML = '';
  arr.forEach((entry, idx)=>{
    const li = document.createElement('li');
    li.innerText = `${idx+1}. ${entry.name} — ${entry.score}`;
    LEADERBOARD.appendChild(li);
  });
}

// ==================== RESET & ULANG ====================
RESET_SCORES.addEventListener('click', ()=>{
  if (!confirm('Yakin ingin menghapus semua skor?')) return;
  localStorage.removeItem(LS_KEY);
  LEADERBOARD.innerHTML = '';
  alert('Papan skor direset.');
});

PLAY_AGAIN.addEventListener('click', ()=>{
  SCOREBOARD.classList.remove('active');
  score = 0;
  answered.fill(false);
  selectedOption = null;
  updateLiveScore();
  VIDEO.currentTime = 0;
  VIDEO.play();
});

// ==================== ANTISIPASI SKIP ====================
let lastTime = 0;
VIDEO.addEventListener('timeupdate', () => { lastTime = VIDEO.currentTime; });
VIDEO.addEventListener('seeking', () => {
  const diff = VIDEO.currentTime - lastTime;
  if (diff > 10) VIDEO.currentTime = lastTime;
});

// ==================== DASHBOARD DI AKHIR VIDEO ====================
VIDEO.addEventListener('ended', () => {
  setTimeout(() => {
    showScoreboardAndSave();
  }, 1000);
});

// ==================== INIT ====================
window.addEventListener('load', ()=>{
  attachOverlay(QUIZ_OVERLAY);
  attachOverlay(FEEDBACK_OVERLAY);
  attachOverlay(SCOREBOARD);
  populateLeaderboardUI(readLeaderboard());
});


