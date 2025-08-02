const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Authorization middleware
const authorizeUser = (req, res, next) => {
  const token = req.query.Authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).send('<h1 align="center"> Login to Continue </h1>');
  }

  try {
    // Verify and decode the token
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY, { algorithms: ['HS256'] });
    req.user = decodedToken;

    // Improved logging: show full payload, fallback to role if username is missing
    console.log(`Authorized user: ${req.user.username || req.user.email || req.user.voterId || 'Unknown'} (${req.user.role || 'N/A'})`);

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid authorization token' });
  }
};

// -------------------- Static File Serving --------------------
app.use('/css', express.static(path.join(__dirname, 'src/css')));
app.use('/csss', express.static(path.join(__dirname, 'src/csss')));
app.use('/js', express.static(path.join(__dirname, 'src/js')));
app.use('/assets', express.static(path.join(__dirname, 'src/assets')));
app.use('/dist', express.static(path.join(__dirname, 'src/dist')));

// -------------------- HTML Routes --------------------
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/home.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/home.html'));
});

app.get('/admin', authorizeUser, (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/admin.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/login.html'));
});

app.get('/admin.html', authorizeUser, (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/admin.html'));
});

app.get('/index.html', authorizeUser, (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/index.html'));
});

// -------------------- Individual Static File Routes --------------------
app.get('/js/login.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/js/login.js'));
});

app.get('/css/login.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/css/login.css'));
});

app.get('/css/index.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/css/index.css'));
});

app.get('/css/admin.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/css/admin.css'));
});

app.get('/assets/eth5.jpg', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/assets/eth5.jpg'));
});

app.get('/js/app.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/js/app.js'));
});

app.get('/dist/login.bundle.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/dist/login.bundle.js'));
});

app.get('/dist/app.bundle.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/dist/app.bundle.js'));
});

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/favicon.ico'));
});

// -------------------- 404 Fallback --------------------
app.use((req, res) => {
  res.status(404).send('<h1 align="center">404 - Page Not Found</h1>');
});

// -------------------- Start Server --------------------
app.listen(8080, () => {
  console.log('Server listening on http://localhost:8080');
});
