import { Router } from "express";
import db from "../database/connection.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

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

export default router;