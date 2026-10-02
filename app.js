// ==================== FIREBASE SETUP ====================
// Replace these with your project credentials from Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

// DOM References
const authModal = document.getElementById('auth-modal');
const phoneStep = document.getElementById('phone-step');
const otpStep = document.getElementById('otp-step');
const phoneNumberInput = document.getElementById('phone-number');
const otpCodeInput = document.getElementById('otp-code');
const sendOtpBtn = document.getElementById('send-otp-btn');
const verifyOtpBtn = document.getElementById('verify-otp-btn');
const backToPhoneBtn = document.getElementById('back-to-phone');
const authError = document.getElementById('auth-error');
const userPhoneTag = document.getElementById('user-phone-tag');
const logoutBtn = document.getElementById('logout-btn');

let confirmationResult = null;

// Initialize invisible recaptcha
window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
  size: 'invisible'
});

// Check existing login session
auth.onAuthStateChanged((user) => {
  if (user) {
    authModal.classList.add('hidden');
    userPhoneTag.textContent = user.phoneNumber || 'VIP User';
  } else {
    authModal.classList.remove('hidden');
  }
});

// Send OTP
sendOtpBtn.addEventListener('click', () => {
  authError.textContent = '';
  const num = phoneNumberInput.value.trim();
  if (num.length !== 10) {
    authError.textContent = 'Please enter a valid 10-digit phone number.';
    return;
  }

  const fullPhone = '+91' + num;
  auth.signInWithPhoneNumber(fullPhone, window.recaptchaVerifier)
    .then((result) => {
      confirmationResult = result;
      phoneStep.classList.add('hidden');
      otpStep.classList.remove('hidden');
    })
    .catch((err) => {
      authError.textContent = err.message;
      window.recaptchaVerifier.render().then(widgetId => grecaptcha.reset(widgetId));
    });
});

// Verify OTP
verifyOtpBtn.addEventListener('click', () => {
  authError.textContent = '';
  const code = otpCodeInput.value.trim();
  if (code.length !== 6) {
    authError.textContent = 'Enter the complete 6-digit OTP.';
    return;
  }

  confirmationResult.confirm(code)
    .then(() => {
      authModal.classList.add('hidden');
    })
    .catch((err) => {
      authError.textContent = 'Invalid code: ' + err.message;
    });
});

backToPhoneBtn.addEventListener('click', () => {
  otpStep.classList.add('hidden');
  phoneStep.classList.remove('hidden');
});

logoutBtn.addEventListener('click', () => {
  auth.signOut();
});


// ==================== SECRET HUB TRIGGER ====================
const secretTrigger = document.getElementById('secret-trigger');
const chatLayer = document.getElementById('chat-layer');
const earningLayer = document.getElementById('earning-layer');
const lockBtn = document.getElementById('lock-btn');

let tapCount = 0;
let tapTimer = null;

secretTrigger.addEventListener('click', () => {
  tapCount++;
  clearTimeout(tapTimer);
  tapTimer = setTimeout(() => { tapCount = 0; }, 900);

  if (tapCount === 3) {
    chatLayer.classList.add('hidden');
    earningLayer.classList.remove('hidden');
    tapCount = 0;
  }
});

lockBtn.addEventListener('click', () => {
  earningLayer.classList.add('hidden');
  chatLayer.classList.remove('hidden');
});


// ==================== WORKING DISGUISE CHAT ====================
const chatItems = document.querySelectorAll('.chat-item');
const convScreen = document.getElementById('conversation-view');
const closeConvBtn = document.getElementById('close-conv-btn');
const convName = document.getElementById('conv-name');
const messagesContainer = document.getElementById('messages-container');
const chatInputBar = document.getElementById('chat-input-bar');
const chatInput = document.getElementById('chat-input');

let currentChatId = null;
const conversationHistory = {
  alex: [
    { sender: 'them', text: "Hey, are you free for a call?" },
    { sender: 'them', text: "Let's review the mockups later tonight." }
  ],
  team: [
    { sender: 'them', text: "Sprint planning starts at 3 PM UTC." }
  ],
  sarah: [
    { sender: 'them', text: "See you tomorrow!" }
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

chatInputBar.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text || !currentChatId) return;

  conversationHistory[currentChatId].push({ sender: 'me', text });
  renderMessages(currentChatId);
  chatInput.value = '';

  // Update snippet
  const snippet = document.getElementById(`snippet-${currentChatId}`);
  if (snippet) snippet.textContent = text;

  // Realistic mock reply after 1.5 seconds
  setTimeout(() => {
    conversationHistory[currentChatId].push({ sender: 'them', text: 'Sounds good!' });
    renderMessages(currentChatId);
  }, 1500);
});


// ==================== EARNING HUB & TASKS ====================
let balance = parseFloat(localStorage.getItem('zanira_balance') || '0.00');
let tasksCount = parseInt(localStorage.getItem('zanira_tasks') || '0', 10);

const balanceDisplay = document.getElementById('wallet-balance');
const tasksDoneDisplay = document.getElementById('tasks-done');
const checkinBtn = document.getElementById('checkin-btn');
const scratchBtn = document.getElementById('scratch-btn');
const videoAdBtn = document.getElementById('video-ad-btn');

function updateUI() {
  balanceDisplay.textContent = balance.toFixed(2);
  tasksDoneDisplay.textContent = tasksCount;
  localStorage.setItem('zanira_balance', balance.toString());
  localStorage.setItem('zanira_tasks', tasksCount.toString());
}
updateUI();

// Task 1: Check-in
checkinBtn.addEventListener('click', () => {
  balance += 5.00;
  tasksCount++;
  updateUI();
  checkinBtn.textContent = 'Claimed ✓';
  checkinBtn.disabled = true;
});

// Task 2: Scratch Card (Random reward)
scratchBtn.addEventListener('click', () => {
  const won = Math.floor(Math.random() * 15) + 5;
  balance += won;
  tasksCount++;
  updateUI();
  scratchBtn.textContent = `Won ₹${won} ✓`;
  scratchBtn.disabled = true;
});

// Task 3: 5-second simulated video reward
videoAdBtn.addEventListener('click', () => {
  videoAdBtn.disabled = true;
  videoAdBtn.textContent = 'Watching (5s)...';
  setTimeout(() => {
    balance += 3.50;
    tasksCount++;
    updateUI();
    videoAdBtn.textContent = 'Rewarded +₹3.50 ✓';
  }, 5000);
});


// ==================== WITHDRAWAL MODAL ====================
const withdrawModal = document.getElementById('withdraw-modal');
const openWithdrawBtn = document.getElementById('open-withdraw-btn');
const closeWithdrawBtn = document.getElementById('close-withdraw-btn');
const submitWithdrawBtn = document.getElementById('submit-withdraw-btn');
const upiInput = document.getElementById('upi-id');
const amountInput = document.getElementById('withdraw-amount');
const withdrawStatus = document.getElementById('withdraw-status');

openWithdrawBtn.addEventListener('click', () => {
  withdrawModal.classList.remove('hidden');
  withdrawStatus.textContent = '';
});

closeWithdrawBtn.addEventListener('click', () => {
  withdrawModal.classList.add('hidden');
});

submitWithdrawBtn.addEventListener('click', () => {
  const upi = upiInput.value.trim();
  const amt = parseFloat(amountInput.value);

  if (!upi.includes('@')) {
    withdrawStatus.style.color = '#f85149';
    withdrawStatus.textContent = 'Enter a valid UPI ID (e.g. name@upi)';
    return;
  }
  if (isNaN(amt) || amt < 100) {
    withdrawStatus.style.color = '#f85149';
    withdrawStatus.textContent = 'Minimum payout amount is ₹100.';
    return;
  }
  if (amt > balance) {
    withdrawStatus.style.color = '#f85149';
    withdrawStatus.textContent = 'Insufficient balance.';
    return;
  }

  balance -= amt;
  updateUI();
  withdrawStatus.style.color = '#3fb950';
  withdrawStatus.textContent = `Payout request of ₹${amt.toFixed(2)} submitted to ${upi}!`;
  setTimeout(() => {
    withdrawModal.classList.add('hidden');
    amountInput.value = '';
  }, 2000);
});
