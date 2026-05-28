import db from "../database/connection.js";

function listMemberMiddleware(req, res, next) {
    const listMembers = db
        .prepare(`SELECT user_id FROM list_members WHERE list_id = ?`)
        .all(req.params.listId);

    const isMember = listMembers.some(
        ({ user_id }) => user_id === req.session.userID,
    );

    if (!isMember) {
        return res.status(403).json({ error: "You don't have permission to edit this list." });
    }
    next();
}

export default listMemberMiddleware;