const form = document.getElementById('chatForm');
const promptBox = document.getElementById('prompt');
const messages = document.getElementById('messages');
const welcome = document.getElementById('welcome');
const sidebar = document.getElementById('sidebar');

function addMessage(text, role) {
  const item = document.createElement('div');
  item.className = `message ${role}`;
  item.textContent = text;
  messages.appendChild(item);
  item.scrollIntoView({behavior:'smooth', block:'end'});
}

function sendMessage(text) {
  const clean = text.trim();
  if (!clean) return;
  welcome.hidden = true;
  addMessage(clean, 'user');
  addMessage('आपका संदेश मिल गया! अभी JARVIS Preview Mode में है। असली AI जवाब चालू करने के लिए अगले चरण में सुरक्षित AI API और सर्वर जोड़ेंगे।', 'assistant');
  promptBox.value = '';
  promptBox.style.height = 'auto';
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  sendMessage(promptBox.value);
});

promptBox.addEventListener('input', () => {
  promptBox.style.height = 'auto';
  promptBox.style.height = Math.min(promptBox.scrollHeight, 130) + 'px';
});

document.querySelectorAll('.suggestion').forEach(button => {
  button.addEventListener('click', () => sendMessage(button.textContent.replace(/^\S+\s*/, '')));
});

document.getElementById('newChat').addEventListener('click', () => {
  messages.innerHTML = '';
  welcome.hidden = false;
  sidebar.classList.remove('open');
});

document.getElementById('menuBtn').addEventListener('click', () => {
  sidebar.classList.toggle('open');
});
