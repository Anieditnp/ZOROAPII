const express = require('express');
const app = express();
const rateLimit = require("express-rate-limit");
const jwt = require('jsonwebtoken');
const secretKey = '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';
const limiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 5,
  message: "Too many requests from this IP, please try again later."
});

app.use('/api/', limiter);


function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
}

app.get('/api/question', authenticateToken, async (req, res) => {
  try {
    const response = await processUserQuestion(req.query.question);
    res.json({ answer: response });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

app.get('/api/owner', (req, res) => {
  res.json({ owner: 'Strawhat Luffy' });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
