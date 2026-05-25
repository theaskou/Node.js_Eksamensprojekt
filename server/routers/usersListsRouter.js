import { Router } from "express";
import db from "../database/connection.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.get("/users/:id/lists", (req, res) => {
  const rows = db
    .prepare(
      `
    SELECT lists.list_name, list_members.user_id FROM lists 
    INNER JOIN list_members ON lists.id = list_members.list_id
    WHERE lists.id IN (SELECT list_id FROM list_members WHERE user_id = ?)
  `,
    )
    .all(req.params.id);

  const lists = {};
  for (const row of rows) {
    if (!lists[row.list_name]) {
      lists[row.list_name] = [];
    }
    lists[row.list_name].push(row.user_id);
  }

  res.json({ data: lists });
});

export default router;
