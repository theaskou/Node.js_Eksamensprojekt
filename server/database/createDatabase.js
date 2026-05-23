import db from "./connection.js";
import pwdHashing from "../passwordHandling/passwordHashing.js";
import seedData from "./seedData.js";

db.exec(`DROP TABLE IF EXISTS list_items;`);
db.exec(`DROP TABLE IF EXISTS list_members;`);
db.exec(`DROP TABLE IF EXISTS lists;`);
db.exec(`DROP TABLE IF EXISTS users;`);

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name VARCHAR(60) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    pwd VARCHAR(100) NOT NULL,
    verified INTEGER NOT NULL DEFAULT 0,
    avatar INTEGER,
    color INTEGER
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS lists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    list_name VARCHAR(100) NOT NULL,
    created_by INTEGER NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS list_members (
    user_id INTEGER NOT NULL,
    list_id INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, list_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (list_id) REFERENCES lists(id)
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS list_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    list_id INTEGER NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    added_by INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    checked INTEGER NOT NULL DEFAULT 0,
    checked_by INTEGER,
    FOREIGN KEY (list_id) REFERENCES lists(id),
    FOREIGN KEY (added_by) REFERENCES users(id),
    FOREIGN KEY (checked_by) REFERENCES users(id)
    );
`);

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
  `INSERT INTO lists (id, list_name, created_by) VALUES (?, ?, ?)`,
);

for (const list of seedData.lists) {
  seedLists.run(list.id, list.name, list.created_by);
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
