import { Router } from "express";
import db from "../database/connection.js";
import authMiddleware from "../middleware/authMiddleware.js";
import listMemberMiddleware from "../middleware/listMemberMiddleware.js";

const router = Router();

router.get("/users/:id/lists", authMiddleware, (req, res) => {
  const listId = req.params.id;
  const rows = db
    .prepare(
      `
            SELECT lists.list_id, lists.list_name, lists.created_at, users.user_id, users.user_name, users.avatar, users.color
            FROM lists
            INNER JOIN list_members ON lists.list_id = list_members.list_id
            INNER JOIN users ON list_members.user_id = users.user_id
            WHERE lists.list_id IN (SELECT list_id FROM list_members WHERE user_id = ?);
        `,
    )
    .all(listId);

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
      memberId: row.user_id,
      userName: row.user_name,
      avatar: row.avatar,
      color: row.color,
    });
  }

  res.json({ data: lists });
});

router.get(
  "/lists/:listId/members",
  authMiddleware,
  listMemberMiddleware,
  (req, res) => {
    const { listId } = req.params;
    const members = db
      .prepare(
        `
        SELECT users.user_id AS memberId, users.user_name AS userName, users.avatar, users.color
        FROM list_members
        INNER JOIN users ON list_members.user_id = users.user_id
        WHERE list_members.list_id = ?
    `,
      )
      .all(listId);

    res.json({ members });
  },
);

router.post("/lists", authMiddleware, (req, res) => {
  const { listName } = req.body;
  const userId = req.session.userId;
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
