import { Router } from "express";
import db from "../database/connection.js";
import authMiddleware from "../middleware/authMiddleware.js";
import deleteAuthentication from "../utils/passwordHandling/deleteAuth.js";
import rateLimiter from "../utils/rateLimiters/rateLimiter.js";

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

router.post("/users/:id/delete", rateLimiter, authMiddleware, async (req, res) => {
  const userId = Number(req.params.id);
  const verifiedId = req.session.userId;
  const { pwd } = req.body;

  if (userId !== verifiedId) {
    return res.status(403).json({
      error: "You do not have permission to delete an account you do not own",
    });
  }

  try {
    await deleteAuthentication(verifiedId, pwd);

    const result = db
      .prepare(`DELETE FROM users WHERE user_id = ?`)
      .run(verifiedId);

    if (!result.changes) {
      return res.status(404).json({ error: "User not found" });
    }

    req.session.destroy();
    res.status(200).json({ deleted: result.changes });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    res.status(error.status ?? 500).json({ error: "Failed to delete user" });
  }
});

export default router;