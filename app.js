
const form = document.getElementById('chatForm');
const promptBox = document.getElementById('prompt');
const messages = document.getElementById('messages');
const welcome = document.getElementById('welcome');
const sidebar = document.getElementById('sidebar');
const chatList = document.getElementById('chatList');

const STORAGE_KEY = 'jarvis_chat_history';

let history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

function saveHistory() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

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

function restoreHistory() {
  history.forEach(msg => {
    addMessage(msg.text, msg.role, false);
  });

  if (history.length) welcome.hidden = true;
}

function updateChatList() {
  chatList.innerHTML = '<div class="chat-item active">✦ बातचीत</div>';
}

function getTime() {
  return new Intl.DateTimeFormat('hi-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(new Date());
}

function getDate() {
  return new Intl.DateTimeFormat('hi-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());
}

function getReply(text) {
  const q = text.toLowerCase().trim();

  if (q.includes('समय') || q.includes('टाइम') || q.includes('time')) {
    return `अभी समय है ${getTime()}।`;
  }

  if (q.includes('तारीख') || q.includes('दिनांक') || q.includes('date')) {
    return `आज ${getDate()} है।`;
  }

  if (q.includes('यूट्यूब') || q.includes('youtube')) {
    window.open('https://www.youtube.com/', '_blank', 'noopener,noreferrer');
    return 'जी! YouTube खोलने की कोशिश कर रहा हूँ।';
  }

  if (q.includes('गूगल') || q.includes('google')) {
    window.open('https://www.google.com/', '_blank', 'noopener,noreferrer');
    return 'जी! Google खोलने की कोशिश कर रहा हूँ।';
  }

  if (q.includes('तुम्हारा नाम') || q.includes('तुम कौन हो')) {
    return 'मेरा नाम JARVIS है। मैं आपका Personal Assistant हूँ।';
  }

  return 'मैं अभी शुरुआती JARVIS मोड में हूँ। फिलहाल मैं समय, तारीख और वेबसाइट खोलने जैसे कमांड समझ सकता हूँ।';
}

function sendMessage(text) {
  const clean = text.trim();
  if (!clean) return;

  welcome.hidden = true;
  addMessage(clean, 'user');

  const reply = getReply(clean);
  addMessage(reply, 'assistant');

  promptBox.value = '';
  promptBox.style.height = 'auto';
}

form.addEventListener('submit', event => {
  event.preventDefault();
  sendMessage(promptBox.value);
});

promptBox.addEventListener('input', () => {
  promptBox.style.height = 'auto';
  promptBox.style.height =
    Math.min(promptBox.scrollHeight, 130) + 'px';
});

document.querySelectorAll('.suggestion').forEach(button => {
  button.addEventListener('click', () => {
    sendMessage(button.textContent.replace(/^\S+\s*/, ''));
  });
});

document.getElementById('newChat').addEventListener('click', () => {
  messages.innerHTML = '';
  history = [];
  saveHistory();
  welcome.hidden = false;
  sidebar.classList.remove('open');
  updateChatList();
});

document.getElementById('menuBtn').addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

restoreHistory();
updateChatList();
