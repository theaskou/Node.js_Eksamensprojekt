import db from "./connection.js";
import seedDatabase from "./seeding/seedDatabase.js";

db.exec(`DROP TABLE IF EXISTS list_items;`);
db.exec(`DROP TABLE IF EXISTS list_members;`);
db.exec(`DROP TABLE IF EXISTS lists;`);
db.exec(`DROP TABLE IF EXISTS users;`);

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name VARCHAR(60) NOT NULL,
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

seedDatabase();
