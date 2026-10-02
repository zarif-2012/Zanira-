// ==================== 1. PERSISTENT STORAGE ====================
let balance = parseFloat(localStorage.getItem('zanira_balance') || '50.00');
let tasksCount = parseInt(localStorage.getItem('zanira_tasks') || '1', 10);
let spinsLeft = parseInt(localStorage.getItem('zanira_spins') || '3', 10);
let userPhone = localStorage.getItem('zanira_user_phone') || null;

const balanceDisplay = document.getElementById('wallet-balance');
const tasksDoneDisplay = document.getElementById('tasks-done');
const spinCountDisplay = document.getElementById('spin-count');
const userPhoneTag = document.getElementById('user-phone-tag');

function syncStorage() {
  balanceDisplay.textContent = balance.toFixed(2);
  tasksDoneDisplay.textContent = tasksCount;
  spinCountDisplay.textContent = spinsLeft;
  if (userPhone) userPhoneTag.textContent = userPhone;

  localStorage.setItem('zanira_balance', balance.toString());
  localStorage.setItem('zanira_tasks', tasksCount.toString());
  localStorage.setItem('zanira_spins', spinsLeft.toString());
}
syncStorage();

// Reset stats button
document.getElementById('reset-balance-btn').addEventListener('click', () => {
  if (confirm('Reset wallet and restart demo stats?')) {
    balance = 50.00;
    tasksCount = 1;
    spinsLeft = 3;
    syncStorage();
  }
});


// ==================== 2. PHONE NUMBER LOGIN ====================
const authModal = document.getElementById('auth-modal');
const phoneStep = document.getElementById('phone-step');
const otpStep = document.getElementById('otp-step');
const phoneInput = document.getElementById('phone-number');
const otpInput = document.getElementById('otp-code');
const sendOtpBtn = document.getElementById('send-otp-btn');
const verifyOtpBtn = document.getElementById('verify-otp-btn');
const backToPhoneBtn = document.getElementById('back-to-phone');
const authError = document.getElementById('auth-error');
const logoutBtn = document.getElementById('logout-btn');

if (!userPhone) {
  authModal.classList.remove('hidden');
}

sendOtpBtn.addEventListener('click', () => {
  const num = phoneInput.value.trim();
  if (num.length !== 10 || isNaN(num)) {
    authError.textContent = 'Please enter a valid 10-digit mobile number.';
    return;
  }
  authError.textContent = '';
  phoneStep.classList.add('hidden');
  otpStep.classList.remove('hidden');
  otpInput.value = '778899'; // Auto-fill demo OTP
});

verifyOtpBtn.addEventListener('click', () => {
  const code = otpInput.value.trim();
  if (code === '778899' || code.length === 6) {
    userPhone = '+91 ' + phoneInput.value.trim();
    localStorage.setItem('zanira_user_phone', userPhone);
    syncStorage();
    authModal.classList.add('hidden');
  } else {
    authError.textContent = 'Invalid verification code.';
  }
});

backToPhoneBtn.addEventListener('click', () => {
  otpStep.classList.add('hidden');
  phoneStep.classList.remove('hidden');
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('zanira_user_phone');
  userPhone = null;
  authModal.classList.remove('hidden');
  phoneStep.classList.remove('hidden');
  otpStep.classList.add('hidden');
  phoneInput.value = '';
});


// ==================== 3. TABS NAVIGATION & SEARCH ====================
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = {
  chats: document.getElementById('tab-chats'),
  status: document.getElementById('tab-status'),
  calls: document.getElementById('tab-calls')
};

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const target = btn.getAttribute('data-tab');
    Object.keys(tabContents).forEach(key => {
      if (key === target) {
        tabContents[key].classList.remove('hidden');
      } else {
        tabContents[key].classList.add('hidden');
      }
    });
  });
});

// Search drawer toggle & filter
const searchToggleBtn = document.getElementById('search-toggle-btn');
const searchDrawer = document.getElementById('search-bar-drawer');
const contactSearchInput = document.getElementById('contact-search-input');
const chatItems = document.querySelectorAll('.chat-item');

searchToggleBtn.addEventListener('click', () => {
  searchDrawer.classList.toggle('hidden');
  if (!searchDrawer.classList.contains('hidden')) {
    contactSearchInput.focus();
  }
});

contactSearchInput.addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase();
  chatItems.forEach(item => {
    const name = item.getAttribute('data-name').toLowerCase();
    item.style.display = name.includes(q) ? 'flex' : 'none';
  });
});


// ==================== 4. ACTIVE CONVERSATION SCREEN ====================
const convScreen = document.getElementById('conversation-view');
const closeConvBtn = document.getElementById('close-conv-btn');
const convName = document.getElementById('conv-name');
const convStatus = document.getElementById('conv-status');
const messagesContainer = document.getElementById('messages-container');
const chatInputBar = document.getElementById('chat-input-bar');
const chatInput = document.getElementById('chat-input');
const emojiQuickBtn = document.getElementById('emoji-quick-btn');

let currentChatId = null;
const conversationHistory = {
  alex: [
    { sender: 'them', text: "Hey! Did you check out the new Zanira updates?" },
    { sender: 'them', text: "Let's review the mockups later tonight." }
  ],
  team: [
    { sender: 'them', text: "Sprint planning starts at 3 PM UTC. All members join on time." }
  ],
  sarah: [
    { sender: 'them', text: "Hey, see you tomorrow at lunch!" }
  ]
};

function renderMessages(chatId) {
  messagesContainer.innerHTML = '';
  (conversationHistory[chatId] || []).forEach(msg => {
    const bubble = document.createElement('div');
    bubble.className = `bubble ${msg.sender === 'me' ? 'sent' : 'received'}`;
    bubble.textContent = msg.text;
    messagesContainer.appendChild(bubble);
  });
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

chatItems.forEach(item => {
  item.addEventListener('click', () => {
    currentChatId = item.getAttribute('data-id');
    convName.textContent = item.getAttribute('data-name');
    renderMessages(currentChatId);
    convScreen.classList.remove('hidden');
  });
});

closeConvBtn.addEventListener('click', () => {
  convScreen.classList.add('hidden');
});

emojiQuickBtn.addEventListener('click', () => {
  const emojis = ['🔥', '✨', '👍', '❤️', '🚀', '🎉'];
  chatInput.value += emojis[Math.floor(Math.random() * emojis.length)];
  chatInput.focus();
});

chatInputBar.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text || !currentChatId) return;

  conversationHistory[currentChatId].push({ sender: 'me', text });
  renderMessages(currentChatId);
  chatInput.value = '';

  const snippet = document.getElementById(`snippet-${currentChatId}`);
  if (snippet) snippet.textContent = text;

  // Live Simulated Reply with typing status
  convStatus.textContent = 'typing...';
  setTimeout(() => {
    const replies = [
      "Got it! Sounds good.",
      "Awesome, on it right now.",
      "Check your notifications!",
      "Super cool! Let's talk soon."
    ];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    conversationHistory[currentChatId].push({ sender: 'them', text: reply });
    renderMessages(currentChatId);
    convStatus.textContent = 'online';
    if (snippet) snippet.textContent = reply;
  }, 1200);
});


// ==================== 5. SECRET GESTURE & TEASER ====================
const secretTrigger = document.getElementById('secret-trigger');
const teaserModal = document.getElementById('teaser-modal');
const unlockSecretBtn = document.getElementById('unlock-secret-btn');
const closeTeaserBtn = document.getElementById('close-teaser-btn');

const chatLayer = document.getElementById('chat-layer');
const earningLayer = document.getElementById('earning-layer');
const lockBtn = document.getElementById('lock-btn');

let tapCount = 0;
let tapTimer = null;

secretTrigger.addEventListener('click', () => {
  tapCount++;
  clearTimeout(tapTimer);
  tapTimer = setTimeout(() => { tapCount = 0; }, 850);

  if (tapCount === 3) {
    teaserModal.classList.remove('hidden');
    tapCount = 0;
  }
});

unlockSecretBtn.addEventListener('click', () => {
  teaserModal.classList.add('hidden');
  chatLayer.classList.add('hidden');
  earningLayer.classList.remove('hidden');
});

closeTeaserBtn.addEventListener('click', () => {
  teaserModal.classList.add('hidden');
});

lockBtn.addEventListener('click', () => {
  earningLayer.classList.add('hidden');
  chatLayer.classList.remove('hidden');
});


// ==================== 6. ANIMATED LUCKY WHEEL ====================
const canvas = document.getElementById('wheel-canvas');
const ctx = canvas.getContext('2d');
const spinWheelBtn = document.getElementById('spin-wheel-btn');

const wheelPrizes = [
  { label: "₹5", value: 5, color: "#ec4899" },
  { label: "₹20", value: 20, color: "#8b5cf6" },
  { label: "₹2", value: 2, color: "#06b6d4" },
  { label: "₹50", value: 50, color: "#f59e0b" },
  { label: "₹10", value: 10, color: "#10b981" },
  { label: "₹1", value: 1, color: "#3b82f6" }
];

let startAngle = 0;
const arc = Math.PI / (wheelPrizes.length / 2);
let spinTimeout = null;
let spinAngleStart = 0;
let spinTime = 0;
let spinTimeTotal = 0;

function drawRouletteWheel() {
  const outsideRadius = 120;
  const textRadius = 85;
  const insideRadius = 25;

  ctx.clearRect(0, 0, 260, 260);

  for (let i = 0; i < wheelPrizes.length; i++) {
    const angle = startAngle + i * arc;
    ctx.fillStyle = wheelPrizes[i].color;

    ctx.beginPath();
    ctx.arc(130, 130, outsideRadius, angle, angle + arc, false);
    ctx.arc(130, 130, insideRadius, angle + arc, angle, true);
    ctx.fill();

    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.font = 'bold 15px sans-serif';
    ctx.translate(130 + Math.cos(angle + arc / 2) * textRadius, 130 + Math.sin(angle + arc / 2) * textRadius);
    ctx.rotate(angle + arc / 2 + Math.PI / 2);
    ctx.fillText(wheelPrizes[i].label, -ctx.measureText(wheelPrizes[i].label).width / 2, 0);
    ctx.restore();
  }
}
drawRouletteWheel();

function rotateWheel() {
  spinTime += 30;
  if (spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI / 180);
  drawRouletteWheel();
  spinTimeout = requestAnimationFrame(rotateWheel);
}

function stopRotateWheel() {
  const degrees = startAngle * 180 / Math.PI + 90;
  const arcd = arc * 180 / Math.PI;
  const index = Math.floor((360 - degrees % 360) / arcd);
  const prize = wheelPrizes[index];

  balance += prize.value;
  spinsLeft--;
  tasksCount++;
  syncStorage();

  spinWheelBtn.disabled = false;
  spinWheelBtn.textContent = `Won ${prize.label}! Spin Again`;
}

function easeOut(t, b, c, d) {
  const ts = (t /= d) * t;
  const tc = ts * t;
  return b + c * (tc + -3 * ts + 3 * t);
}

spinWheelBtn.addEventListener('click', () => {
  if (spinsLeft <= 0) {
    alert("No spins remaining for today! Complete other tasks.");
    return;
  }
  spinWheelBtn.disabled = true;
  spinWheelBtn.textContent = 'Spinning...';
  spinAngleStart = Math.random() * 10 + 20;
  spinTime = 0;
  spinTimeTotal = Math.random() * 2000 + 3000;
  rotateWheel();
});


// ==================== 7. TASKS (CHECK-IN, SCRATCH, VIDEO) ====================
const checkinBtn = document.getElementById('checkin-btn');
const scratchBtn = document.getElementById('scratch-btn');
const videoAdBtn = document.getElementById('video-ad-btn');

checkinBtn.addEventListener('click', () => {
  balance += 10.00;
  tasksCount++;
  syncStorage();
  checkinBtn.textContent = 'Claimed +₹10 ✓';
  checkinBtn.disabled = true;
});

scratchBtn.addEventListener('click', () => {
  const won = Math.floor(Math.random() * 20) + 5;
  balance += won;
  tasksCount++;
  syncStorage();
  scratchBtn.textContent = `Won ₹${won} ✓`;
  scratchBtn.disabled = true;
});

videoAdBtn.addEventListener('click', () => {
  videoAdBtn.disabled = true;
  let sec = 5;
  const timer = setInterval(() => {
    videoAdBtn.textContent = `Playing (${sec}s)...`;
    sec--;
    if (sec < 0) {
      clearInterval(timer);
      balance += 5.00;
      tasksCount++;
      syncStorage();
      videoAdBtn.textContent = 'Rewarded +₹5.00 ✓';
    }
  }, 1000);
});


// ==================== 8. UPI WITHDRAWAL MODAL ====================
const withdrawModal = document.getElementById('withdraw-modal');
const openWithdrawBtn = document.getElementById('open-withdraw-btn');
const closeWithdrawBtn = document.getElementById('close-withdraw-btn');
const closeWithdrawX = document.getElementById('close-withdraw-x');
const submitWithdrawBtn = document.getElementById('submit-withdraw-btn');
const upiInput = document.getElementById('upi-id');
const amountInput = document.getElementById('withdraw-amount');
const withdrawStatus = document.getElementById('withdraw-status');

openWithdrawBtn.addEventListener('click', () => {
  withdrawModal.classList.remove('hidden');
  withdrawStatus.textContent = '';
});

function closeWithdraw() {
  withdrawModal.classList.add('hidden');
}
closeWithdrawBtn.addEventListener('click', closeWithdraw);
closeWithdrawX.addEventListener('click', closeWithdraw);

submitWithdrawBtn.addEventListener('click', () => {
  const upi = upiInput.value.trim();
  const amt = parseFloat(amountInput.value);

  if (!upi.includes('@')) {
    withdrawStatus.style.color = '#f87171';
    withdrawStatus.textContent = 'Please enter a valid UPI address (e.g. mobile@upi).';
    return;
  }
  if (isNaN(amt) || amt < 100) {
    withdrawStatus.style.color = '#f87171';
    withdrawStatus.textContent = 'Minimum payout threshold is ₹100.';
    return;
  }
  if (amt > balance) {
    withdrawStatus.style.color = '#f87171';
    withdrawStatus.textContent = `Insufficient balance. Current balance is ₹${balance.toFixed(2)}`;
    return;
  }

  balance -= amt;
  syncStorage();
  withdrawStatus.style.color = '#34d399';
  withdrawStatus.textContent = `Success! ₹${amt.toFixed(2)} transfer initiated to ${upi}.`;
  setTimeout(() => {
    closeWithdraw();
    amountInput.value = '';
  }, 2200);
});
// ==================== LIVE FIREBASE INITIALIZATION ====================
const firebaseConfig = {
  apiKey: "AIzaSyAoNaAx17GuNmETjmSf4OsrisTXkjMfIlE",
  authDomain: "zanira-e1d54.firebaseapp.com",
  projectId: "zanira-e1d54",
  storageBucket: "zanira-e1d54.firebasestorage.app",
  messagingSenderId: "274319354869",
  appId: "1:274319354869:web:169ae126b1943e92f7cebc",
  measurementId: "G-MV8KH56444"
};

// Initialize Firebase SDK
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

// DOM references
const authModal = document.getElementById('auth-modal');
const phoneStep = document.getElementById('phone-step');
const otpStep = document.getElementById('otp-step');
const phoneInput = document.getElementById('phone-number');
const otpInput = document.getElementById('otp-code');
const sendOtpBtn = document.getElementById('send-otp-btn');
const verifyOtpBtn = document.getElementById('verify-otp-btn');
const backToPhoneBtn = document.getElementById('back-to-phone');
const authError = document.getElementById('auth-error');
const userPhoneTag = document.getElementById('user-phone-tag');
const logoutBtn = document.getElementById('logout-btn');

let confirmationResult = null;

// Initialize Invisible reCAPTCHA
window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
  size: 'invisible',
  callback: (response) => {
    // reCAPTCHA solved
  },
  'expired-callback': () => {
    authError.textContent = 'Verification expired. Please try again.';
  }
});

// Real-time Authentication Listener
auth.onAuthStateChanged((user) => {
  if (user) {
    authModal.classList.add('hidden');
    if (userPhoneTag) userPhoneTag.textContent = user.phoneNumber || 'User';
  } else {
    authModal.classList.remove('hidden');
  }
});

// Send SMS OTP
sendOtpBtn.addEventListener('click', () => {
  authError.textContent = '';
  const num = phoneInput.value.trim();

  if (num.length !== 10 || isNaN(num)) {
    authError.textContent = 'Please enter a valid 10-digit phone number.';
    return;
  }

  const fullPhone = '+91' + num;
  sendOtpBtn.disabled = true;
  sendOtpBtn.textContent = 'Sending SMS...';

  auth.signInWithPhoneNumber(fullPhone, window.recaptchaVerifier)
    .then((result) => {
      confirmationResult = result;
      phoneStep.classList.add('hidden');
      otpStep.classList.remove('hidden');
      sendOtpBtn.disabled = false;
      sendOtpBtn.textContent = 'Get OTP';
    })
    .catch((err) => {
      sendOtpBtn.disabled = false;
      sendOtpBtn.textContent = 'Get OTP';
      authError.textContent = err.message;
      if (window.grecaptcha && window.recaptchaWidgetId !== undefined) {
        grecaptcha.reset(window.recaptchaWidgetId);
      }
    });
});

// Verify SMS OTP
verifyOtpBtn.addEventListener('click', () => {
  authError.textContent = '';
  const code = otpInput.value.trim();

  if (code.length !== 6) {
    authError.textContent = 'Enter the 6-digit code received.';
    return;
  }

  verifyOtpBtn.disabled = true;
  verifyOtpBtn.textContent = 'Verifying...';

  confirmationResult.confirm(code)
    .then(() => {
      verifyOtpBtn.disabled = false;
      verifyOtpBtn.textContent = 'Verify & Proceed';
      otpInput.value = '';
    })
    .catch((err) => {
      verifyOtpBtn.disabled = false;
      verifyOtpBtn.textContent = 'Verify & Proceed';
      authError.textContent = 'Invalid OTP: ' + err.message;
    });
});

backToPhoneBtn.addEventListener('click', () => {
  otpStep.classList.add('hidden');
  phoneStep.classList.remove('hidden');
});

logoutBtn.addEventListener('click', () => {
  auth.signOut().then(() => {
    phoneStep.classList.remove('hidden');
    otpStep.classList.add('hidden');
    phoneInput.value = '';
  });
});
