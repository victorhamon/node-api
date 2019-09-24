'use strict';

var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

exports.send = async (to, body) => {
    client.messages.create({
        body: body,
        to: to,  // Text this number
        from: process.env.TWILIO_NUMBER // From a valid Twilio number
    })
    .then((message) => console.log(message.sid));
}