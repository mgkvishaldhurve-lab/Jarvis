
const form = document.getElementById('chatForm');
const promptBox = document.getElementById('prompt');
const messages = document.getElementById('messages');
const welcome = document.getElementById('welcome');
const sidebar = document.getElementById('sidebar');
const chatList = document.getElementById('chatList');

const STORAGE_KEY = 'jarvis_chat_history';

let history = [];

try {
  history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  if (!Array.isArray(history)) history = [];
} catch {
  history = [];
}

// MIC BUTTON
const micBtn = document.createElement('button');
micBtn.type = 'button';
micBtn.textContent = '🎙️';
micBtn.title = 'बोलकर सवाल पूछें';
micBtn.setAttribute('aria-label', 'माइक्रोफोन से सवाल पूछें');

micBtn.style.cssText = `
  width:40px;
  height:39px;
  border:1px solid #2a3b55;
  border-radius:12px;
  background:#17243a;
  color:white;
  font-size:19px;
  cursor:pointer;
  flex-shrink:0;
`;

const sendBtn = form.querySelector('.send-btn');
form.insertBefore(micBtn, sendBtn);

// SAVE CHAT
function saveHistory() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('History save error:', error);
  }
}

// SHOW MESSAGE
function addMessage(text, role, save = true) {
  const item = document.createElement('div');
  item.className = `message ${role}`;
  item.textContent = text;
  messages.appendChild(item);

  if (save) {
    history.push({ text, role });
    saveHistory();
  }

  item.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

// VOICE REPLY
function speak(text) {
  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = 'hi-IN';
  speech.rate = 0.95;
  speech.pitch = 1;

  window.speechSynthesis.speak(speech);
}

// TIME
function getTime() {
  return new Intl.DateTimeFormat('hi-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(new Date());
}

// DATE
function getDate() {
  return new Intl.DateTimeFormat('hi-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());
}

// JARVIS COMMANDS
function getReply(text) {
  const q = text.toLowerCase().trim();

  if (
    q.includes('समय') ||
    q.includes('टाइम') ||
    q.includes('time')
  ) {
    return `अभी समय है ${getTime()}।`;
  }

  if (
    q.includes('तारीख') ||
    q.includes('दिनांक') ||
    q.includes('date')
  ) {
    return `आज ${getDate()} है।`;
  }

  if (q.includes('यूट्यूब') || q.includes('youtube')) {
    window.open(
      'https://www.youtube.com/',
      '_blank',
      'noopener,noreferrer'
    );
    return 'जी! YouTube खोलने की कोशिश कर रहा हूँ।';
  }

  if (q.includes('गूगल') || q.includes('google')) {
    window.open(
      'https://www.google.com/',
      '_blank',
      'noopener,noreferrer'
    );
    return 'जी! Google खोलने की कोशिश कर रहा हूँ।';
  }

  if (
    q.includes('तुम्हारा नाम') ||
    q.includes('तुम कौन हो')
  ) {
    return 'मेरा नाम JARVIS है। मैं आपका Personal Assistant हूँ।';
  }

  if (q.includes('नमस्ते') || q.includes('हेलो')) {
    return 'नमस्ते! मैं JARVIS हूँ। बताइए, मैं आपकी क्या मदद करूँ?';
  }

  return 'मैं आपका JARVIS Assistant हूँ। अभी मैं समय, तारीख, Google और YouTube के कमांड समझ सकता हूँ।';
}

// SEND MESSAGE
function sendMessage(text) {
  const clean = text.trim();
  if (!clean) return;

  welcome.hidden = true;

  addMessage(clean, 'user');

  const reply = getReply(clean);

  addMessage(reply, 'assistant');

  // Speak the answer
  speak(reply);

  promptBox.value = '';
  promptBox.style.height = 'auto';
}

// TEXT CHAT
form.addEventListener('submit', (event) => {
  event.preventDefault();
  sendMessage(promptBox.value);
});

// TEXTAREA SIZE
promptBox.addEventListener('input', () => {
  promptBox.style.height = 'auto';
  promptBox.style.height =
    Math.min(promptBox.scrollHeight, 130) + 'px';
});

// SUGGESTIONS
document.querySelectorAll('.suggestion').forEach(button => {
  button.addEventListener('click', () => {
    sendMessage(
      button.textContent.replace(/^\S+\s*/, '')
    );
  });
});

// MICROPHONE
const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

let recognition = null;
let listening = false;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = 'hi-IN';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    listening = true;
    micBtn.textContent = '🔴';
    micBtn.title = 'सुन रहा हूँ...';
  };

  recognition.onresult = (event) => {
    const transcript =
      event.results[0][0].transcript;

    promptBox.value = transcript;
    sendMessage(transcript);
  };

  recognition.onerror = (event) => {
    console.log('Microphone error:', event.error);
    micBtn.textContent = '🎙️';
  };

  recognition.onend = () => {
    listening = false;
    micBtn.textContent = '🎙️';
    micBtn.title = 'बोलकर सवाल पूछें';
  };

} else {
  micBtn.title = 'इस ब्राउज़र में Speech Recognition उपलब्ध नहीं है';
}

micBtn.addEventListener('click', () => {
  if (!recognition) {
    alert('आपके ब्राउज़र में Voice Recognition सपोर्ट नहीं है। Chrome में कोशिश करें।');
    return;
  }

  if (listening) {
    recognition.stop();
  } else {
    try {
      recognition.start();
    } catch (error) {
      console.log(error);
    }
  }
});

// NEW CHAT
document.getElementById('newChat').addEventListener('click', () => {
  messages.innerHTML = '';
  history = [];
  saveHistory();

  window.speechSynthesis?.cancel();

  welcome.hidden = false;
  sidebar.classList.remove('open');
  updateChatList();
});

// CHAT LIST
function updateChatList() {
  chatList.innerHTML =
    '<div class="chat-item active">✦ बातचीत</div>';
}

// MOBILE MENU
document.getElementById('menuBtn').addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

// RESTORE OLD CHAT
function restoreHistory() {
  history.forEach(msg => {
    addMessage(msg.text, msg.role, false);
  });

  if (history.length) {
    welcome.hidden = true;
  }
}

restoreHistory();
updateChatList();
