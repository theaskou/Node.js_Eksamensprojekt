import { Router } from "express";
import passwordAuthentication from "../utils/passwordHandling/passwordAuth.js";
import rateLimiter from "../utils/rateLimiters/rateLimiter.js";

const router = Router();

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

export default router;
