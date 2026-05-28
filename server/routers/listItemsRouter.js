import { Router } from "express";
import db from "../database/connection.js";
import authMiddleware from "../middleware/authMiddleware.js";
import listMemberMiddleware from "../middleware/listMemberMiddleware.js";

const router = Router();

router.get("/lists/:listId/items", authMiddleware, (req, res) => {
  const getListItems = db
    .prepare(
      `
        SELECT * FROM list_items WHERE list_id = ?;
        `,
    )
    .all(req.params.listId);

  const getListName = db
    .prepare(`SELECT list_name from lists WHERE list_id = ?`)
    .get(req.params.listId);

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
    });
  }

  res.json({ listName, listItems });
});

router.post("/lists/:listId/listitems", authMiddleware, listMemberMiddleware, (req, res) => {
  const { itemName } = req.body;
  const addListItem = db
    .prepare(
      `
        INSERT INTO list_items (list_id, item_name, added_by) VALUES (?, ?, ?)
        `,
    )
    .run(req.params.listId, itemName, req.session.userID);

  res.send({ data: addListItem });
});

router.put("/lists/:listId/listitems/:itemId", authMiddleware, listMemberMiddleware, (req, res) => {
  const listId = req.params.listId;
  const itemID = req.params.itemId;

  const updatedItemName = req.body;
  const update = db
    .prepare(
      `
      INSERT INTO list_items.item_name VALUES ?`,
    )
    .run(updatedItemName);
});

router.delete(
  "/lists/:listId/listitems/:itemId",
  authMiddleware,
  listMemberMiddleware,
  (req, res) => {
    const listId = req.params.listId;
    const itemID = req.params.itemId;

    const result = db
      .prepare(
        `
        DELETE FROM list_items
        WHERE item_id = ? AND list_id = ?
    `,
      )
      .run(itemID, listId);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted successfully" });
  },
);

export default router;
