import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import db from "../database/connection.js";

const router = Router();

router.get("/authcheck", authMiddleware, (req, res) => {
  const user = db
    .prepare("SELECT user_id, email FROM users WHERE user_id = ?")
    .get(req.session.userID);
  res.json({ userID: user.user_id, email: user.email });
});

export default router;
