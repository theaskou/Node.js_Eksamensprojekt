import { Router } from "express";
import db from "../database/connection.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.post("/lists", authMiddleware, (req, res) => {
  const { listName } = req.body;
  const userID = req.session.userID;
  const insertLists = db
    .prepare(
      `
        INSERT INTO lists (list_name, created_by) VALUES (?, ?)`,
    )
    .run(listName, userID);

  console.log("insertLists:", insertLists);

  const insertListsMembers = db
    .prepare(
      `
      INSERT INTO list_members (user_id, list_id) VALUES (?, ?)`,
    )
    .run(userID, insertLists.lastInsertRowid);

  res
    .status(201)
    .json({ data: { listID: insertLists.lastInsertRowid, listName } });
});

export default router;
