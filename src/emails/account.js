const sgMail = require("@sendgrid/mail");

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "santa@gmail.com",
    subject: "Thanks for joining in",
    text: `Welcome to the app ${name}. Let me know how you get along with the app.`,
  });
};

const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "santa@gmail.com",
    subject: "Apologies for Inconvinience",
    text: `Hello ${name}. You recently cancelled your account from our Application. We are very sorry for any Inconvinience on our part.Kindly reply to this email with your problem so that we can fix it ASAP.`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail,
};
