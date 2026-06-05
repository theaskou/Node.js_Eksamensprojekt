import "dotenv/config";
import { verificationTokens, invitationTokens } from "./verificationTokens.js";

function getRandomInt() {
  const max = 9999999999;
  const min = 1000000000;
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getVerificationLink(userId) {
  const verificationToken = getRandomInt();
  verificationTokens.set(userId, verificationToken);
  return `${process.env.CLIENT_ORIGIN}/verify?userId=${userId}&token=${verificationToken}`;
}

export function getInvitationLink(userId, listId) {
  const verificationToken = getRandomInt();
  invitationTokens.set(userId, verificationToken);
  return `${process.env.CLIENT_ORIGIN}/acceptinvitation?userId=${userId}&listId=${listId}&token=${verificationToken}`;
}

