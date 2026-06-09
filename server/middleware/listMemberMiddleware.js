import isListMember from "../utils/listMemberCheck.js";

function listMemberMiddleware(req, res, next) {
  const isMember = isListMember(req.session.userId, req.params.listId);

  if (!isMember) {
    return res
      .status(403)
      .json({ error: "User is not a list member" });
  }
  next();
}

export default listMemberMiddleware;
