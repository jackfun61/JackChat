const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('.')); // serve HTML/CSS/JS

app.use(session({
  secret: 'jackchat_secret',
  resave: false,
  saveUninitialized: true
}));

// Simple in-memory storage (reset on restart) 
const users = {};       // { username: hashedPassword }
const messages = [];    // { user: username, msg: message }

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send('Missing username/password');
  if (users[username]) return res.status(400).send('Username already exists');

  const hash = await bcrypt.hash(password, 10);
  users[username] = hash;
  req.session.user = username;
  res.send('OK');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const hash = users[username];
  if (!hash) return res.status(400).send('User not found');

  const match = await bcrypt.compare(password, hash);
  if (!match) return res.status(400).send('Incorrect password');

  req.session.user = username;
  res.send('OK');
});

app.post('/send', (req, res) => {
  if (!req.session.user) return res.status(401).send('Not logged in');
  const msg = req.body.msg;
  messages.push({ user: req.session.user, msg });
  res.send('OK');
});

app.get('/messages', (req, res) => {
  res.json(messages);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
