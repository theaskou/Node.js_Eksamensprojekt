import { Router } from "express";
import db from "../database/connection.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.post("/lists", authMiddleware, (req, res) => {
  const { listName } = req.body;
  const userId = req.session.userID;
  const insertLists = db
    .prepare(
      `
        INSERT INTO lists (list_name, created_by) VALUES (?, ?)`,
    )
    .run(listName, userId);

  const insertListsMembers = db
    .prepare(
      `
      INSERT INTO list_members (user_id, list_id) VALUES (?, ?)`,
    )
    .run(userId, insertLists.lastInsertRowid);

  res
    .status(201)
    .json({ data: { listId: insertLists.lastInsertRowid, listName } });
});

export default router;
