import { Router } from "express";
import db from "../database/connection.js";
import authMiddleware from "../middleware/authMiddleware.js";
import passwordAuthentication from "../utils/passwordHandling/passwordAuth.js";
import verificationTokens from "../utils/emails/verificationTokens.js";
import pwdHashing from "../utils/passwordHandling/passwordHashing.js";
import rateLimiter from "../utils/rateLimiters/rateLimiter.js";
import sendVerificationEmail from "../utils/emails/sendEmails.js";

const router = Router();

router.get("/authcheck", authMiddleware, (req, res) => {
  const user = db
    .prepare("SELECT user_id, email FROM users WHERE user_id = ?")
    .get(req.session.userID);
  res.json({ userID: user.user_id, email: user.email });
});

router.post("/login", rateLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    const authenticatedUser = await passwordAuthentication(email, password);

    if (!authenticatedUser) {
      return res.status(401).json({ error: "Wrong credentials" });
    }

    req.session.userID = authenticatedUser.user_id;

    res.send({ data: authenticatedUser.user_id });
  } catch (error) {
    res.status(error.status ?? 500).json({ error: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => res.send({ data: "Session destroyed" }));
});

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

router.get("/users/:id/verify/:token", (req, res) => {
  try {
    const userID = Number(req.params.id);
    const token = Number(req.params.token);

    const expectedToken = verificationTokens.get(userID);

    if (!expectedToken || token !== expectedToken) {
      return res.status(400).json({ error: "Invalid token" });
    }

    const result = db
      .prepare("UPDATE users SET verified = 1 WHERE user_id = ?")
      .run(userID);

    if (result.changes === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    verificationTokens.delete(userID);
    res.status(200).json({ message: "Account verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
