import { Router } from "express";
import db from "../database/connection.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.get("/users/avatars", authMiddleware, (req, res) => {
  const ids = req.query.ids.split(",").map(Number);
  const placeholders = ids.map(() => "?").join(",");
  const avatars = db
    .prepare(
      `SELECT id, avatar, color FROM users WHERE id IN (${placeholders})`,
    )
    .all(...ids);
  res.json(avatars);
});

export default router;
