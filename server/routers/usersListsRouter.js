import { Router } from "express";
import db from "../database/connection.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.get("/users/:id/lists", authMiddleware, (req, res) => {
  const rows = db
    .prepare(
      `
SELECT lists.id AS list_id, lists.list_name, users.id AS user_id, users.avatar, users.color
  FROM lists
  INNER JOIN list_members ON lists.id = list_members.list_id
  INNER JOIN users ON list_members.user_id = users.id
  WHERE lists.id IN (SELECT list_id FROM list_members WHERE user_id = ?)
`,
    )
    .all(req.params.id);

  const lists = [];
  for (const row of rows) {
    let list = lists.find((l) => l.listName === row.list_name);
    if (!list) {
      list = { listID: row.list_id, listName: row.list_name, members: [] };
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

export default router;
