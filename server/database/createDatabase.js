import db from "./connection.js";
import seedDatabase from "./seeding/seedDatabase.js";

db.exec(`DROP TABLE IF EXISTS list_items;`);
db.exec(`DROP TABLE IF EXISTS list_members;`);
db.exec(`DROP TABLE IF EXISTS lists;`);
db.exec(`DROP TABLE IF EXISTS users;`);

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name VARCHAR(60) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    pwd VARCHAR(100) NOT NULL,
    verified INTEGER NOT NULL DEFAULT 0,
    avatar VARCHAR(50),
    color VARCHAR(50)
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS lists (
    list_id INTEGER PRIMARY KEY AUTOINCREMENT,
    list_name VARCHAR(100) NOT NULL,
    created_by INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (created_by) REFERENCES users(user_id)
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS list_members (
    user_id INTEGER NOT NULL,
    list_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, list_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (list_id) REFERENCES lists(list_id)
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS list_items (
    item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    list_id INTEGER NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    added_by INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    checked INTEGER NOT NULL DEFAULT 0,
    checked_by INTEGER,
    FOREIGN KEY (list_id) REFERENCES lists(list_id),
    FOREIGN KEY (added_by) REFERENCES users(user_id),
    FOREIGN KEY (checked_by) REFERENCES users(user_id)
    );
`);

db.prepare(`INSERT INTO users VALUES (?, ?, ?, ?, ?)`)

INSERT INTO users (
    user_id,
    user_name,
    email,
    pwd,
    verified
)
VALUES (
    1,
    'Deleted User',
    'deleted@system.local',
    '',
    1
);

seedDatabase();
