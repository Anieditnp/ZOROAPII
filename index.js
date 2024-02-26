const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const OpenAI = require('openai'); // OpenAI package

const app = express();
const PORT = process.env.PORT || 3000;
const APP_SECRET = 'EAAGNO4a7r2wBOzuH621hNHVrKBGW9tvcvTV66zVSI1AqPuBmamq8ZCYEh9f9dHw6GFVs8fAZAW0KDhqRsaU365igCD1lFChaC5D8kmE1lYPUaoZBlqy3biZCiRT3uHPYaoJa6XDt0XWxS5HWeZBkPAlI0elLfGf9minpYo3makYjlrmv0UZAs57ePZBugZDZD'; 
const OPENAI_SECRET_KEY = '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'; 
const openai = new OpenAI(OPENAI_SECRET_KEY);

app.use(bodyParser.json());

// Handler for GET requests to the root route
app.get('/', (req, res) => {
  res.send('Welcome to Zoro API');
});

// Webhook endpoint for receiving messages from Messenger
app.post('/webhook', (req, res) => {
  const body = req.body;

  // Verify request signature to ensure it's from Facebook
  if (verifySignature(req.headers['x-hub-signature'], JSON.stringify(body))) {
    // Handle incoming messages
    handleMessages(body);
    res.status(200).send('OK');
  } else {
    res.sendStatus(403);
  }
});

// Verify the request signature
function verifySignature(signature, body) {
  const hash = crypto.createHmac('sha1', APP_SECRET).update(body).digest('hex');
  const expectedSignature = `sha1=${hash}`;
  return signature === expectedSignature;
}

// Handle incoming messages from Messenger
function handleMessages(body) {
  // Process incoming messages and send responses in the style of Zoro
  // You can use OpenAI to generate Zoro-like responses here
  const userMessage = body.message;
  
  // Use OpenAI to generate Zoro-like responses
  openai.complete({
    engine: 'davinci',
    prompt: userMessage,
    maxTokens: 150,
    temperature: 0.9,
    topP: 1,
    presencePenalty: 0,
    frequencyPenalty: 0,
    stop: ['\n'],
  }).then((response) => {
    const zoroResponse = response.data.choices[0].text.trim();
    // Send zoroResponse back to Messenger
    sendMessengerResponse(zoroResponse);
  }).catch((error) => {
    console.error('Error generating Zoro-like response:', error);
    // Handle error
  });
}

// Function to send response back to Messenger
function sendMessengerResponse(response) {
  // Implement logic to send response back to Messenger
}

app.listen(PORT, () => {
  console.log(`Zoro API is running on port ${PORT}`);
});
