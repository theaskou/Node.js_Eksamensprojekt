import bcrypt from "bcrypt";
import db from "../../database/connection.js";

async function deleteAuthentication(userId, password) {
  const user = db
    .prepare(`SELECT pwd FROM users WHERE user_id = ?`)
    .get(userId);

  if (!user) {
    throw new Error("User not found");
    return;
  }

  const isAuthenticated = await bcrypt.compare(password, user.pwd);

  if (!isAuthenticated) {
    throw new Error("Not authorized");
    return;
  }

  return true;
}

export default deleteAuthentication;
