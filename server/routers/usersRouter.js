import { Router } from "express";
import db from "../database/connection.js"
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.get("/users/me", authMiddleware, (req, res) => {
    const user = db.prepare("SELECT id, user_name, avatar, color FROM users WHERE id = ?").get(req.session.userID);
    res.json({ userID: user.id, userName: user.user_name, avatar: user.avatar, color: user.color });

})

export default router;