'use strict';

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.send = async (to, subject, body) => {
    const msg = {
        to: to,
        from: 'nao-responda@node-str.com',
        subject: subject,
        text: 'and easy to do anywhere, even with Node.js',
        html: body
      };
      sgMail.send(msg);
}