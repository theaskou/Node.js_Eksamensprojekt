import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync("./database/database.db");

db.exec("PRAGMA foreign_keys = ON;");

export default db;