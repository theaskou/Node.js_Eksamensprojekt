import { Router } from "express";
import db from "../database/connection.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.get("/users/:id/lists", authMiddleware, (req, res) => {
  const rows = db
    .prepare(
      `
            SELECT lists.list_id, lists.list_name, lists.created_at, users.user_id, users.avatar, users.color
            FROM lists
            INNER JOIN list_members ON lists.list_id = list_members.list_id
            INNER JOIN users ON list_members.user_id = users.user_id
            WHERE lists.list_id IN (SELECT list_id FROM list_members WHERE user_id = ?)
        `,
    )
    .all(req.params.id);

  const lists = [];
  for (const row of rows) {
    let list = lists.find((l) => l.listName === row.list_name);
    if (!list) {
      list = {
        listId: row.list_id,
        listName: row.list_name,
        createdAt: row.created_at,
        members: [],
      };
      lists.push(list);
    }
    list.members.push({
      memberID: row.user_id,
      avatar: row.avatar,
      color: row.color,
    });
  }

  res.json({ data: lists });
});

router.post("/lists", authMiddleware, (req, res) => {
  const { listName } = req.body;
  const userId = req.session.userID;
  const listInsert = db
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
    .run(userId, listInsert.lastInsertRowid);

  res
    .status(201)
    .json({ data: { listId: listInsert.lastInsertRowid, listName } });
});

export default router;
