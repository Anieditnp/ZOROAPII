const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

// Dummy function to simulate processing user question
async function processUserQuestion(question) {
  return "Answer to " + question;
}

const secretKey = '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';

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
}

app.get('/', (req, res) => {
  res.send('Welcome to Zoro API');
});

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

app.use((req, res) => {
  res.status(404).send('404 - Not Found');
});

const PORT = process.env.PORT || 3000; // Use port from environment variable or default to 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
