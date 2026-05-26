import { json, Router } from "express";
import db from "../database/connection.js";

const router = Router();

router.get("/lists/:id/items", (req, res) => {
  const getListItems = db
    .prepare(
      `
        SELECT * FROM list_items WHERE list_id = ?;
        `,
    )
    .all(req.params.id);

  const getListName = db
    .prepare(`SELECT list_name from lists WHERE list_id = ?`)
    .run(req.params.id);

  const listItems = getListName = [];

  for (const listItem of getListItems) {
    listItems.push(
      ({
        itemID: listItem.item_id,
        itemName: listItem.item_name,
        addedBy: listItem.added_by,
        createdAt: listItem.created_at,
        checked: listItem.checked,
        checkedBy: listItem.checked_by,
      }),
    );
  }

  console.log(listItems);
  res.json({ listItems });
});

export default router;
