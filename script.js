// ----- JackChat Script.js -----

let currentUser = null;
let bannedWords = [];

// ---- Load banned words and emojis ----
Promise.all([
  fetch('en.txt').then(res => res.text().then(t => t.split('\n'))),
  fetch('emoji.txt').then(res => res.text().then(t => t.split('\n')))
]).then(arrays => {
  bannedWords = arrays.flat().map(item => item.toLowerCase());
  console.log("Banned words/emoji loaded:", bannedWords.length);
});

// ---- Login/Register ----
document.getElementById('loginBtn').addEventListener('click', function() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) return alert("Enter username & password");

  // Example: replace with your server login check
  fetch('/login', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ username, password })
  }).then(res => res.json())
    .then(data => {
      if (data.success) {
        currentUser = username;
        alert(`Logged in as ${username}`);
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('chatForm').style.display = 'block';
      } else {
        alert(data.message);
      }
    });
});

document.getElementById('registerBtn').addEventListener('click', function() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) return alert("Enter username & password");

  // Example: replace with your server registration check
  fetch('/register', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ username, password })
  }).then(res => res.json())
    .then(data => {
      if (data.success) {
        alert(`Registered ${username}. You can now log in.`);
      } else {
        alert(data.message);
      }
    });
});

// ---- Send message ----
function sendMessage() {
  if (!currentUser) return alert("You must log in first!");
  
  const msgInput = document.getElementById('msgInput');
  let message = msgInput.value.trim();

  // ---- Filter banned words/phrases/emojis ----
  const containsBanned = bannedWords.some(word =>
    message.toLowerCase().includes(word)
  );

  if (containsBanned) {
    alert("Please do not send inappropriate content!");
    msgInput.value = "";
    return;
  }

  // ---- Send message to server ----
  fetch('/send', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ username: currentUser, message })
  });

  msgInput.value = "";
}

// ---- Enter key to send message ----
document.getElementById('msgInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') sendMessage();
});
