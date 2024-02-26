// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Validate incoming messages
function validateMessage(body) {
  if (!body || !body.message || !body.message.text) {
    throw new Error('Invalid message format');
  }
}

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

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
    }).catch((error) => {
      console.error('Error generating Zoro-like response:', error);
      // Handle error
      sendMessengerResponse("I'm experiencing some technical difficulties. Please try again later.");
    });
  } catch (error) {
    console.error('Error handling message:', error);
    // Handle error
    sendMessengerResponse("I'm experiencing some technical difficulties. Please try again later.");
  }
}

// Function to send response back to Messenger
function sendMessengerResponse(response) {
  // Implement logic to send response back to Messenger
  // For example, you can use a Messenger API library or make HTTP requests directly
  // For demonstration purposes, let's log the response
  console.log("Zoro's response:", response);
}

app.listen(PORT, () => {
  console.log(`Zoro API is running on port ${PORT}`);
});
