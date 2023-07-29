exports.handler = function (context, event, callback) {
  if (event.api_key !== process.env.PAIN_TRACKER_API_KEY) {
    return callback("Invalid API key.");
  }

  const twilioClient = context.getTwilioClient();
  twilioClient.messages
    .create({
      body: "On a scale of 1-10, how was your pain today?",
      to: process.env.ALLOWED_PHONE_NUMBER,
      messagingServiceSid: process.env.MESSAGING_SERVICE_SID,
    })
    .then((message) => {
      console.log("SMS successfully sent");
      console.log(message.sid);
      return callback(null, "success");
    })
    .catch((error) => {
      console.log(error);
      return callback(error);
    });
};
