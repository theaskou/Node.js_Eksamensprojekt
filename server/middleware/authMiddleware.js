function authMiddleware(req, res, next) {
  if (!req.session.userID) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

export default authMiddleware;
