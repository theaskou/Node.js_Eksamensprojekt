import { Router } from "express";
import db from "../database/connection.js";
import authMiddleware from "../middleware/authMiddleware.js";
import session from "express-session";

const router = Router();

router.get("/lists/:id/items", authMiddleware, (req, res) => {
  const getListItems = db
    .prepare(
      `
        SELECT * FROM list_items WHERE list_id = ?;
        `,
    )
    .all(req.params.id);

  const getListName = db
    .prepare(`SELECT list_name from lists WHERE list_id = ?`)
    .get(req.params.id);

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

router.post("/lists/:id/listitems", authMiddleware, (req, res) => {
  const { itemName } = req.body;
  const addListItem = db
    .prepare(
      `
        INSERT INTO list_items (list_id, item_name, added_by) VALUES (?, ?, ?)
        `,
    )
    .run(req.params.id, itemName, req.session.userID);

  res.send({ data: addListItem });
});

router.delete(
  "/lists/:listId/listitems/:itemId",
  authMiddleware,
  (req, res) => {
    const listMembers = db
      .prepare(`SELECT user_id FROM list_members WHERE list_id = ?`)
      .all(req.params.listId);

    const usercheck = listMembers.find(
      ({ user_id }) => user_id === req.session.userID,
    );
    if (!usercheck) {
      return res.json({ error: "You don't have permisson to delete this" });
    }

    const result = db
      .prepare(
        `
        DELETE FROM list_items
        WHERE item_id = ? AND list_id = ?
    `,
      )
      .run(req.params.itemId, req.params.listId);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted successfully" });
  },
);

export default router;
