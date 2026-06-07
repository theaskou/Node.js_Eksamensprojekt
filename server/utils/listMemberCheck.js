import db from "../database/connection.js";

function isListMember(userId, listId) {
  const result = db
    .prepare(
      `
        SELECT 1 FROM list_members WHERE user_id = ? AND list_id = ?`,
    )
    .get(userId, listId);
  return result !== undefined;
}

export default isListMember;
