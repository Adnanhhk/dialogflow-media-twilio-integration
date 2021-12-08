
const express = require('express');
const request = require('request');
const app = express();
const dialogflowSessionClient =
    require('../botlib/dialogflow_session_client.js');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const projectId = 'Place your dialogflow projectId here';
const phoneNumber = "Place your twilio phone number here";
const accountSid = 'Place your accountSid here';
const authToken = 'Place your authToken here';

const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const sessionClient = new dialogflowSessionClient(projectId);

const listener = app.listen(process.env.PORT, function() {
  console.log('Your Twilio integration server is listening on port '
      + listener.address().port);
});

app.post('/', async function(req, res) {
  const body = req.body;
  if (req.body.NumMedia != "0"){
    body = req.body.MediaUrl0;
  }
  const text = body.Body;
  const id = body.From;
  const dialogflowResponse = (await sessionClient.detectIntent(
      text, id, body)).fulfillmentText;
  const twiml = new  MessagingResponse();
  const message = twiml.message(dialogflowResponse);
  res.send(twiml.toString());
});

process.on('SIGTERM', () => {
  listener.close(() => {
    console.log('Closing http server.');
    process.exit(0);
  });
});
