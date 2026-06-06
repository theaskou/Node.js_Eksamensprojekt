import bcrypt from "bcrypt";
import db from "../../database/connection.js";

async function deleteAuthentication(userId, password) {
  const user = db
    .prepare(`SELECT pwd FROM users WHERE user_id = ?`)
    .get(userId);

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  const isAuthenticated = await bcrypt.compare(password, user.pwd);

  if (!isAuthenticated) {
    const error = new Error("Incorrect password");
    error.status = 401;
    throw error;
  }

  return true;
}

export default deleteAuthentication;
