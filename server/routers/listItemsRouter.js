import { Router } from "express";
import db from "../database/connection.js";
import authMiddleware from "../middleware/authMiddleware.js";
import listMemberMiddleware from "../middleware/listMemberMiddleware.js";

const router = Router();

router.get("/lists/:listId/items", authMiddleware, (req, res) => {
  const listId = req.params.listId;
  const getListItems = db
    .prepare(
      `
        SELECT list_items.*, users.color AS checked_by_color
        FROM list_items
        LEFT JOIN users ON list_items.checked_by = users.user_id
        WHERE list_items.list_id = ?`,
    )
    .all(listId);

  const getListName = db
    .prepare(`SELECT list_name from lists WHERE list_id = ?`)
    .get(listId);

  const listItems = [];
  const listName = getListName.list_name;

  for (const listItem of getListItems) {
    listItems.push({
      itemID: listItem.item_id,
      itemName: listItem.item_name,
      addedBy: listItem.added_by,
      createdAt: listItem.created_at,
      checked: listItem.checked,
      checkedBy: listItem.checked_by,
      checkedByColor: listItem.checked_by_color,
    });
  }

  res.json({ listName, listItems });
});

router.post(
  "/lists/:listId/listitems",
  authMiddleware,
  listMemberMiddleware,
  (req, res) => {
    const { itemName } = req.body;
    const listId = req.params.listId;
    const userId = req.session.userID;

    const addListItem = db
      .prepare(
        `
        INSERT INTO list_items (list_id, item_name, added_by) VALUES (?, ?, ?)
        `,
      )
      .run(listId, itemName, userId);

    res.send({ data: addListItem });
  },
);

router.put(
  "/lists/:listId/listitems/:itemId",
  authMiddleware,
  listMemberMiddleware,
  (req, res) => {
    const { itemName } = req.body;
    const listId = req.params.listId;
    const itemId = req.params.itemId;

    const result = db
      .prepare(
        `
        UPDATE list_items
        SET item_name = ?
        WHERE item_id = ? AND list_id = ?
    `,
      )
      .run(itemName, itemId, listId);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json({ message: "Item updated" });
  },
);

router.put(
  "/lists/:listId/listitems/:itemId/checked",
  authMiddleware,
  listMemberMiddleware,
  (req, res) => {
    const { checked } = req.body;
    const { listId, itemId } = req.params;
    const userId = req.session.userID;

    const result = db
      .prepare(
        `
        UPDATE list_items
        SET checked = ?, checked_by = ?
        WHERE item_id = ? AND list_id = ?
    `,
      )
      .run(checked, checked ? userId : null, itemId, listId);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json({ message: "Item updated" });
  },
);

router.delete(
  "/lists/:listId/listitems/:itemId",
  authMiddleware,
  listMemberMiddleware,
  (req, res) => {
    const listId = req.params.listId;
    const itemId = req.params.itemId;

    const result = db
      .prepare(
        `
        DELETE FROM list_items
        WHERE item_id = ? AND list_id = ?
    `,
      )
      .run(itemId, listId);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted" });
  },
);

export default router;
