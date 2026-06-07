import db from "../database/connection.js";
import isListMember from "../utils/listMemberCheck.js";

function listMemberMiddleware(req, res, next) {
  const isMember = isListMember(req.session.userId, req.params.listId);

  if (!isMember) {
    return res
      .status(403)
      .json({ error: "You don't have permission to edit this list." });
  }
  next();
}

export default listMemberMiddleware;
