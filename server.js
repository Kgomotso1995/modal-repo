const express = require('express');
const bodyParser = require('body-parser');
const { WebClient } = require('@slack/web-api');

const app = express();
const port = process.env.PORT || 3000;

// Replace with your Slack Bot Token
const slackToken = 'xoxb-346819963489-8109050309412-oMD4Hx9vzmYZtzwcIkFajWGJ';
const webClient = new WebClient(slackToken);

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Endpoint to handle modal requests
app.post('/modal', async (req, res) => {
  const { alertname, instance } = req.query;

  try {
    // Send the modal using Slack's views.open API
    await webClient.views.open({
      trigger_id: req.body.trigger_id, // Trigger ID from Slack payload
      view: {
        type: 'modal',
        callback_id: 'modal_callback',
        title: {
          type: 'plain_text',
          text: 'Alert Details',
        },
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Alert:* ${alertname}\n*Instance:* ${instance}`,
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'Take necessary action to resolve the alert.',
            },
          },
        ],
      },
    });

    res.status(200).send('Modal triggered!');
  } catch (error) {
    console.error('Error opening modal:', error);
    res.status(500).send('Failed to open modal.');
  }
});

// Test route for health check
app.get('/', (req, res) => {
  res.send('Slack Modal Service is running.');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
