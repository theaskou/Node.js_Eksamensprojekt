import "dotenv/config";
import verificationTokens from "./verificationTokens.js";

function getRandomInt() {
  const max = 9999999999;
  const min = 1000000000;
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getVerificationLink(userID) {
  const verificationToken = getRandomInt();
  verificationTokens.set(userID, verificationToken);
  return `${process.env.SERVER_BASE_URL}/users/${userID}/${verificationToken}`;
}

export default getVerificationLink;
