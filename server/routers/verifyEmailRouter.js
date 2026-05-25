import { Router } from "express";
import verificationTokens from "../utils/emails/verificationTokens.js";
import db from "../database/connection.js"

const router = Router();

router.get("/users/:id/:token", (req, res) => {
  try {
    const userID = Number(req.params.id);
    const token = Number(req.params.token);

    const expectedToken = verificationTokens.get(userID);

    if (!expectedToken || token !== expectedToken) {
      return res.status(400).json({ error: "Invalid token" });
    }

    db.prepare("UPDATE users SET verified = 1 WHERE id = ?").run(userID);
    verificationTokens.delete(userID);

    res.status(200);
    res.json({ message: "Account verified successfully" });
  } catch (error) {
    console.error(error);
  }
});

export default router;
