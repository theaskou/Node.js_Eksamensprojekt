import seedData from "./seedData.js";
import pwdHashing from "../../utils/passwordHandling/passwordHashing.js";
import db from "../connection.js"

async function seedDatabase() {
  const seedUsers = db.prepare(
    `INSERT INTO users (user_name, email, pwd, verified, avatar, color) VALUES (?, ?, ?, ?, ?, ?)`,
  );

  for (const user of seedData.users) {
    const hashedPwd = await pwdHashing(user.pwd);
    seedUsers.run(
      user.user_name,
      user.email,
      hashedPwd,
      user.verified ? 1 : 0,
      user.avatar,
      user.color,
    );
  }

  const seedLists = db.prepare(
    `INSERT INTO lists (list_id, list_name, created_by) VALUES (?, ?, ?)`,
  );

  for (const list of seedData.lists) {
    seedLists.run(list.list_id, list.name, list.created_by);
  }

  const seedListMembers = db.prepare(`
    INSERT INTO list_members (user_id, list_id) VALUES (?, ?)`);

  for (const listMember of seedData.list_members) {
    seedListMembers.run(listMember.user_id, listMember.list_id);
  }

  const seedListItems = db.prepare(`
    INSERT INTO list_items (list_id, item_name, added_by, checked, checked_by) VALUES (?, ?, ?, ?, ?)`);

  for (const listItem of seedData.list_items) {
    seedListItems.run(
      listItem.list_id,
      listItem.item_name,
      listItem.added_by,
      listItem.checked,
      listItem.checked_by ?? null,
    );
  }
}

export default seedDatabase;