const pg = require("pg");

async function getDbClient() {
  const connectionString = process.env.POSTGRES_CONNECTION_STRING;
  const client = new pg.Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  await client.connect();

  return client;
}

async function logPain(severity) {
  const client = await getDbClient();
  const sql = `INSERT INTO pain_log (severity) VALUES ($1)`;
  const values = [severity];
  await client.query(sql, values);
  await client.end();
}

async function logNote(note) {
  const client = await getDbClient();
  const sql = `INSERT INTO pain_notes (note) VALUES ($1)`;
  const values = [note];
  await client.query(sql, values);
  await client.end();
}

exports.handler = function (context, event, callback) {
  const twiml = new Twilio.twiml.MessagingResponse();

  if (event.From !== process.env.ALLOWED_PHONE_NUMBER) {
    twiml.message("Unrecognized sender.");
    callback(null, twiml);
    return;
  } else {
    let severity = parseInt(event.Body, 10);
    if (isNaN(severity)) {
      logNote(event.Body)
        .then(() => {
          twiml.message("Logged your note: " + event.Body);
          callback(null, twiml);
        })
        .catch((error) => {
          console.log(error);
          callback(error);
        });
    } else if (severity < 1 || severity > 10) {
      twiml.message("Please provide a number on a scale from 1 to 10.");
      callback(null, twiml);
    } else {
      logPain(severity)
        .then(() => {
          twiml.message("Got it: " + severity);
          callback(null, twiml);
        })
        .catch((error) => {
          console.log(error);
          callback(error);
        });
    }
  }
};
