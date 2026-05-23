import bcrypt from "bcrypt";
import db from "../../database/connection.js";

async function passwordAuthentication(userName, password) {
  const user = db
    .prepare(`SELECT id, pwd FROM users WHERE user_name = ?`)
    .get(userName);

  if (!user) {
    return;
  }

  const isAuthenticated = await bcrypt.compare(password, user.pwd);

  if (!isAuthenticated) {
    return;
  }

  return user;
}

export default passwordAuthentication;
