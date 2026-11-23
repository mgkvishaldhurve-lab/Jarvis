
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
  item.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function getJarvisReply(question) {
  const q = question.toLowerCase();

  if (q.includes('नमस्ते') || q.includes('hello') || q.includes('hi')) {
    return 'नमस्ते! मैं Vishal हूँ। बताइए, आज मैं आपकी क्या मदद कर सकता हूँ?';
  }

  if (q.includes('गिन्नौरगढ़')) {
    return 'गिन्नौरगढ़ मध्य प्रदेश के रायसेन जिले में स्थित एक ऐतिहासिक किला है। यह गोंडवाना की ऐतिहासिक और सांस्कृतिक विरासत का महत्वपूर्ण प्रतीक है। अपनी विरासत को जानें और सुरक्षित रखें।';
  }

  if (q.includes('आदिवासी') || q.includes('गोंडवाना')) {
    return 'आदिवासी समाज की पहचान उसकी संस्कृति, परंपराओं, भाषा, प्रकृति और सामुदायिक जीवन में है। जल, जंगल और जमीन हमारी विरासत और जीवन से जुड़े महत्वपूर्ण विषय हैं।';
  }

  if (q.includes('कैप्शन') || q.includes('caption')) {
    return 'अपनी पहचान पर गर्व करो, अपनी संस्कृति का सम्मान करो और अपनी विरासत को आने वाली पीढ़ियों तक पहुँचाओ। जय गोंडवाना! जय जोहार!';
  }

  if (q.includes('ai क्या') || q.includes('ai kya')) {
    return 'AI यानी Artificial Intelligence (कृत्रिम बुद्धिमत्ता)। यह ऐसी तकनीक है जिसकी मदद से कंप्यूटर भाषा समझने, सवालों के जवाब देने और कई काम करने में सक्षम होते हैं।';
  }

  if (q.includes('धन्यवाद') || q.includes('thank')) {
    return 'आपका स्वागत है! 😊 JARVIS आपकी सहायता के लिए तैयार है।';
  }

  return 'आपका सवाल अच्छा है! 😊 अभी मैं Demo Mode में हूँ। इस संस्करण में मेरे पास सीमित जानकारी है। असली AI कनेक्शन अगले चरण में जोड़ा जाएगा।';
}

function sendMessage(text) {
  const clean = text.trim();
  if (!clean) return;

  welcome.hidden = true;
  addMessage(clean, 'user');

  const reply = getJarvisReply(clean);
  addMessage(reply, 'assistant');

  promptBox.value = '';
  promptBox.style.height = 'auto';
}

form.addEventListener('submit', (event) => {
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
  welcome.hidden = false;
  sidebar.classList.remove('open');
});

document.getElementById('menuBtn').addEventListener('click', () => {
  sidebar.classList.toggle('open');
});
