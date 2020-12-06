exports.handler = function(context, event, callback) {
  const twiml = new Twilio.twiml.MessagingResponse();

  if(event.From !== process.env.ALLOWED_PHONE_NUMBER) {
    twiml.message('Unrecognized sender.');
    callback(null, twiml);
    return;
  } else {
    const base = require('airtable').base(process.env.AIRTABLE_WORKSPACE_ID);

    let severity = parseInt(event.Body, 10);
    if(isNaN(severity)) {
      base('PainTracker').create([
        {
          fields: {
            "Date / Time": (new Date()).toJSON(),
            Note: event.Body
          }
        }
      ], (err, records) => {
        if (err) {
          console.error(err);
          twiml.message('Error writing to AirTable! ' + err.message);
          callback(null, twiml);
          return;
        }
        twiml.message('Logged your note: ' + records[0].fields.Note);
        callback(null, twiml);
        return;
      });
    } else if (severity < 1 || severity > 10) {
      twiml.message('Please provide a number on a scale from 1 to 10.');
      callback(null, twiml);
      return;
    } else {
      base('PainTracker').create([
        {
          fields: {
            "Date / Time": (new Date()).toJSON(),
            Severity: severity
          }
        }
      ], (err, records) => {
        if (err) {
          console.error(err);
          twiml.message('Error writing to AirTable! ' + err.message);
          callback(null, twiml);
          return;
        }
        twiml.message('Got it: ' + records[0].fields.Severity);
        callback(null, twiml);
        return;
      });
    }
  }
};
