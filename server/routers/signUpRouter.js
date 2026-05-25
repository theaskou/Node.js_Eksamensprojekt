import { Router } from "express";
import db from "../database/connection.js";
import pwdHashing from "../utils/passwordHandling/passwordHashing.js";
import rateLimiter from "../utils/rateLimiters/rateLimiter.js";
import sendVerificationEmail from "../utils/emails/sendEmails.js";

const router = Router();

router.post("/users", rateLimiter, async (req, res) => {
  try {
    const { userName, email, pwd, repeatedPwd } = req.body;

    if (!userName || !email || !pwd || !repeatedPwd) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (pwd !== repeatedPwd) {
      return res
        .status(400)
        .json({ error: "The passwords don't match. Try again." });
    }

    const emailCheck = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email);
    if (emailCheck) {
      return res
        .status(409)
        .json({ error: "email already exists. Try signing in instead." });
    }

    const hashedPwd = await pwdHashing(pwd);

    // TODO: Handle avatar placeholder?
    const insert = db
      .prepare(
        "INSERT INTO users (user_name, email, pwd, verified) VALUES (?, ?, ?, ?)",
      )
      .run(userName, email, hashedPwd, 0);

    const userID = insert.lastInsertRowid;

    req.session.userID = userID;

    sendVerificationEmail(email, userName, userID);

    // TODO: Handle "Remember to verify your email" notification?
    res.status(201).json({ message: "User created successfully" });

  } catch (error) {
    console.error(error);
    res
      .status(error.status ?? 500)
      .json({ message: error.message ?? "Server error" });
  }
});

export default router;
