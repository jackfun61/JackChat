let bannedWords = [];

// Load the .txt files from your project
Promise.all([
  fetch('en.txt').then(res => res.text().then(t => t.split('\n'))),
  fetch('emoji.txt').then(res => res.text().then(t => t.split('\n')))
]).then(arrays => {
  // Combine all words/phrases/emojis into one array
  bannedWords = arrays.flat().map(item => item.toLowerCase());
  console.log("Banned words/emoji loaded:", bannedWords.length);
});

// Function to send messages
function sendMessage() {
  const msgInput = document.getElementById('msgInput');
  let message = msgInput.value.trim();

  // Check for banned words/phrases/emojis (case-insensitive)
  const containsBanned = bannedWords.some(word =>
    message.toLowerCase().includes(word)
  );

  if (containsBanned) {
    alert("Please do not send inappropriate content!");
    msgInput.value = "";
    return;
  }

  // Send the clean message to the server
  fetch('/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, username: currentUser })
  });

  msgInput.value = "";
}

// Optional: allow Enter key to send message
document.getElementById('msgInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') sendMessage();
});
