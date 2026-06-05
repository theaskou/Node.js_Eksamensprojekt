import { Router } from "express";
import db from "../database/connection.js";
import authMiddleware from "../middleware/authMiddleware.js";
import listMemberMiddleware from "../middleware/listMemberMiddleware.js";
import { sendInvitationEmail } from "../utils/emails/sendEmails.js";
import { verificationTokens, invitationTokens } from "../utils/emails/verificationTokens.js";

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

router.post(
  "/lists/:listId/invite",
  authMiddleware,
  listMemberMiddleware,
  (req, res) => {
    const listId = req.params.listId;
    const recieverEmail = req.body.email;
    const invitingUserId = req.session.userId;

    const userCheck = db
      .prepare(
        `
    SELECT user_id, user_name FROM users WHERE email = ?;
    `,
      )
      .get(recieverEmail);

    if (!userCheck) {
      res.status(404).json({ error: "The user is not signed up." });
      return;
    }

    const result = db
      .prepare(
        `
        SELECT lists.list_name, users.user_name AS inviter_name 
        FROM lists
        JOIN users ON users.user_id = ?
        WHERE lists.list_id = ?`,
      )
      .get(invitingUserId, listId);

    const recieverUserId = userCheck.user_id;
    const recieverName = userCheck.user_name;
    const senderName = result.inviter_name;
    const listName = result.list_name;

    sendInvitationEmail(
      recieverEmail,
      recieverUserId,
      recieverName,
      senderName,
      listName,
      listId,
    );

    res.status(200).json({ message: "An email invitation was sent." });
  },
);

router.post("/lists/:listId/members", (req, res) => {
  const { userId, token } = req.body;
  const listId = req.params.listId;
  const expectedToken = invitationTokens.get(Number(userId));

  if (!expectedToken || Number(token) !== expectedToken) {
    return res
      .status(400)
      .json({ error: "Invalid token. User was not added to the list." });
  }

  const result = db
    .prepare(
      `
  INSERT INTO list_members (user_id, list_id) VALUES (?, ?)
  `,
    )
    .run(userId, listId);

  if (result.changes) {
    res.status(200).json({ message: "The user was added to the list." });
    invitationTokens.delete(userId);
  } else {
    res.status(500).json({ error: "Failed to add user to the list." });
  }
});

router.delete(
  "/lists/:listId",
  authMiddleware,
  listMemberMiddleware,
  (req, res) => {
    const listId = req.params.listId;

    const listDeletion = db
      .prepare(
        `
    DELETE FROM lists WHERE list_id = ?
    `,
      )
      .run(listId);

    res.status(200).json({ deleted: listDeletion.changes });
  },
);

export default router;
