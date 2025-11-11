const loginDiv = document.getElementById('loginDiv');
const chatDiv = document.getElementById('chatDiv');
const chatBox = document.getElementById('chat');
const input = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');

document.getElementById('registerBtn').addEventListener('click', async () => {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  if (!username || !password) return alert('Enter username and password');

  const res = await fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (res.ok) showChat();
  else alert(await res.text());
});

document.getElementById('loginBtn').addEventListener('click', async () => {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  if (!username || !password) return alert('Enter username and password');

  const res = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (res.ok) showChat();
  else alert(await res.text());
});

function showChat() {
  loginDiv.style.display = 'none';
  chatDiv.style.display = 'block';
  fetchMessages();
  setInterval(fetchMessages, 1000);
}

sendBtn.addEventListener('click', async () => {
  const msg = input.value.trim();
  if (!msg) return;
  await fetch('/send', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ msg }) });
  input.value = '';
  fetchMessages();
});

input.addEventListener('keydown', e => { if(e.key==='Enter') sendBtn.click(); });

async function fetchMessages() {
  const res = await fetch('/messages');
  const msgs = await res.json();
  chatBox.innerHTML = '';
  msgs.forEach(m => {
    const div = document.createElement('div');
    div.textContent = m.user + ': ' + m.msg;
    chatBox.appendChild(div);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}
