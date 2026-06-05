import nodemailer from "nodemailer";
import { getVerificationLink, getInvitationLink } from "./emailVerificationLinks.js";

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

export async function sendVerificationEmail(emailAddress, userName, userId) {
  const verificationLink = getVerificationLink(userId);

  const info = await transporter.sendMail({
    from: '"Checklist App" <website-email@example.com>',
    to: emailAddress ?? "example@example.com",
    subject: `Welcome ${userName}!`,
    text: `Verify your account here: ${verificationLink}`,
    html: `<h1>Welcome to Checklist App!<h1> <p>Verify your account by clicking
    <a href="${verificationLink}">this link.</a></p>`,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

export async function sendInvitationEmail(
  emailAddress,
  recieverUserId,
  recieverName,
  senderName,
  checklistName,
  listId,
) {
  const acceptInvitationLink = getInvitationLink(recieverUserId, listId);

  const info = await transporter.sendMail({
    from: '"Checklist App" <website-email@example.com>',
    to: emailAddress ?? "example@example.com",
    subject: `${senderName} invited you to their checklist`,
    text: ``,
    html: `
          <h1>Hello ${recieverName}!<h1> 
          <p>${senderName} invited you to join their checklist: ${checklistName}.</p>
          <p>Click <a href="${acceptInvitationLink}">this link</a> to join.</p>`,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
