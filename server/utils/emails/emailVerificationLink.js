import "dotenv/config";
import verificationTokens from "./verificationTokens.js";

function getRandomInt() {
  const max = 9999999999;
  const min = 1000000000;
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getVerificationLink(userId) {
  const verificationToken = getRandomInt();
  verificationTokens.set(userId, verificationToken);
  return `${process.env.CLIENT_ORIGIN}/verify?userId=${userId}&token=${verificationToken}`;
}

export default getVerificationLink;

