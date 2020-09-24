const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

// Function to test adding events in google calendar

const { google } = require('googleapis');

const { OAuth2 } = google.auth;

const oAuth2Client = new OAuth2(
    '929609106294-gro3n08nvrlh8kcb1158lcp1i1gh81ml.apps.googleusercontent.com', 
    'jnc5VMXTIstvZ_sSZsWswqYX'
);

oAuth2Client.setCredentials({
    refresh_token: 
        '1//04Q56Y8JfC_5ECgYIARAAGAQSNwF-L9IrtQkFtBrSV-C57ZNbO4vlK0drdf-7q-kjv9xyOZq8ncUzXWTzkXRbjAorR_llLSO8d2Q'
});

// Create a new calender instance.
const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

// Create a new event start date instance for temp uses in our calendar.
const eventStartTime = new Date()
eventStartTime.setDate(eventStartTime.getDay() + 2)

// Create a new event end date instance for temp uses in our calendar.
const eventEndTime = new Date()
eventEndTime.setDate(eventEndTime.getDay() + 4)
eventEndTime.setMinutes(eventEndTime.getMinutes() + 45)


// Create a dummy event for temp uses in our calendar
const event = {
    summary: `Temp`,
    location: `Admin, Room 001`,
    description: `Test`,
    colorId: 1,
    start: {
      dateTime: eventStartTime,
      timeZone: 'America/Denver',
    },
    end: {
      dateTime: eventEndTime,
      timeZone: 'America/Denver',
    },
  }
  
  // Check if we a busy and have an event on our calendar for the same time.
  calendar.freebusy.query(
    {
      resource: {
        timeMin: eventStartTime,
        timeMax: eventEndTime,
        timeZone: 'America/Denver',
        items: [{ id: 'primary' }],
      },
    },
    (err, res) => {
      // Check for errors in our query and log them if they exist.
      if (err) return console.error('Free Busy Query Error: ', err)
  
      // Create an array of all events on our calendar during that time.
      const eventArr = res.data.calendars.primary.busy
  
      // Check if event array is empty which means we are not busy
      if (eventArr.length === 0)
        // If we are not busy create a new calendar event.
        return calendar.events.insert(
          { calendarId: 'primary', resource: event },
          err => {
            // Check for errors and log them if they exist.
            if (err) return console.error('Error Creating Calender Event:', err)
            // Else log that the event was created.
            return console.log('Calendar event successfully created.')
          }
        )
  
      // If event array is not empty log that we are busy.
      return console.log(`Sorry I'm busy.`)
    }
  )