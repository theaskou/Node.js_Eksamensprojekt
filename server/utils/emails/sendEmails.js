import nodemailer from "nodemailer";
import getVerificationLink from "./emailVerificationLink.js";

const testAccount = await nodemailer.createTestAccount();

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: testAccount.user,
    pass: testAccount.pass,
  },
});

async function sendVerificationEmail(emailAddress, userName, userID) {
  const verificationLink = getVerificationLink(userID);

  const info = await transporter.sendMail({
    from: '"The Website" <website-email@example.com>',
    to: emailAddress ?? "example@example.com",
    subject: `Welcome ${userName ?? "Potatoven"}!`,
    text: `Verify your account here: ${verificationLink}`,
    html: `<h1>Welcome to the website!<h1> <p>Verify your account by clicking
    <a href="${verificationLink}">this link.</a></p>`,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

export default sendVerificationEmail;
