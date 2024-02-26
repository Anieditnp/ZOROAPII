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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Validate incoming messages
function validateMessage(body) {
  if (!body || !body.message || !body.message.text) {
    throw new Error('Invalid message format');
  }
}

// Handle incoming messages from Messenger
function handleMessages(body) {
  try {
    validateMessage(body);
    const userMessage = body.message.text; // Extract text from the message

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
      res.status(200).send('OK'); // Send response to the client
    }).catch((error) => {
      console.error('Error generating Zoro-like response:', error);
      // Handle error
      sendMessengerResponse("I'm experiencing some technical difficulties. Please try again later.");
      res.status(500).send('Internal Server Error'); // Send error response to the client
    });
  } catch (error) {
    console.error('Error handling message:', error);
    // Handle error
    sendMessengerResponse("I'm experiencing some technical difficulties. Please try again later.");
    res.status(500).send('Internal Server Error'); // Send error response to the client
  }
}

// Function to send response back to Messenger
function sendMessengerResponse(response) {
  // Implement logic to send response back to Messenger
  // For example, you can use a Messenger API library or make HTTP requests directly
  // For demonstration purposes, let's log the response
  console.log("Zoro's response:", response);
}

// Verify the request signature
function verifySignature(signature, body) {
  const hash = crypto.createHmac('sha1', APP_SECRET).update(body).digest('hex');
  const expectedSignature = `sha1=${hash}`;
  return signature === expectedSignature;
}

app.get('/', (req, res) => {
  res.send('Welcome to Zoro API');
});

app.post('/webhook', (req, res) => {
  const body = req.body;

  // Verify request signature to ensure it's from Facebook
  if (verifySignature(req.headers['x-hub-signature'], JSON.stringify(body))) {
    // Handle incoming messages
    handleMessages(body);
  } else {
    res.sendStatus(403);
  }
});

app.listen(PORT, () => {
  console.log(`Zoro API is running on port ${PORT}`);
});
