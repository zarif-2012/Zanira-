// --- DOM ELEMENTS ---
const secretTrigger = document.getElementById('secret-trigger');
const chatLayer = document.getElementById('chat-layer');
const earningLayer = document.getElementById('earning-layer');
const lockBtn = document.getElementById('lock-btn');

const balanceDisplay = document.getElementById('wallet-balance');
const checkinBtn = document.getElementById('checkin-btn');
const tasksDoneDisplay = document.getElementById('tasks-done');

// --- SECRET TRIGGER LOGIC ---
let tapCount = 0;
let tapTimer = null;

// Require 3 rapid clicks/taps on "Zanira" within 1 second
secretTrigger.addEventListener('click', () => {
  tapCount++;

  clearTimeout(tapTimer);
  tapTimer = setTimeout(() => {
    tapCount = 0; // reset if user was too slow
  }, 1000);

  if (tapCount === 3) {
    unlockEarningHub();
    tapCount = 0;
  }
});

function unlockEarningHub() {
  chatLayer.classList.add('hidden');
  earningLayer.classList.remove('hidden');
}

// Lock back to disguise
lockBtn.addEventListener('click', () => {
  earningLayer.classList.add('hidden');
  chatLayer.classList.remove('hidden');
});

// --- BASIC EARNING ACTIONS ---
let balance = 245.50;
let completedTasks = 4;

checkinBtn.addEventListener('click', () => {
  balance += 5.00;
  completedTasks += 1;

  balanceDisplay.textContent = balance.toFixed(2);
  tasksDoneDisplay.textContent = completedTasks;

  checkinBtn.textContent = 'Claimed ✓';
  checkinBtn.disabled = true;
});
