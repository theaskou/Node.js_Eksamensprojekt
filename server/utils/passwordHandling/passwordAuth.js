import bcrypt from "bcrypt";
import db from "../../database/connection.js";

async function passwordAuthentication(email, password) {
  const user = db
    .prepare(`SELECT id, pwd FROM users WHERE email = ?`)
    .get(email);

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
