import { Router } from "express";
import db from "../database/connection.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.get("/users/me", authMiddleware, (req, res) => {
  const user = db
    .prepare(
      "SELECT user_id, user_name, avatar, color FROM users WHERE user_id = ?",
    )
    .get(req.session.userId);
  res.json({
    userId: user.user_id,
    userName: user.user_name,
    avatar: user.avatar,
    color: user.color,
  });
});

export default router;
