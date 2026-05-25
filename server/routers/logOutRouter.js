import { Router } from "express";

const router = Router();

router.post("/logout", (req, res) => {
  req.session.destroy(() => res.send({ data: "Session destroyed" }));
});

export default router;
