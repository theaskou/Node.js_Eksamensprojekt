import express from "express";
import isListMember from "./utils/listMemberCheck.js";

const app = express();

app.use(express.json());

import "dotenv/config";

import cors from "cors";

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  }),
);

import session from "express-session";

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 24,
  },
});

app.use(sessionMiddleware);

import helmet from "helmet";
app.use(helmet());

import http from "http";
const server = http.createServer(app);

import { Server } from "socket.io";
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  },
});
io.engine.use(sessionMiddleware);

async function emitOnlineUsers(listId) {
  const room = `list-${listId}`;
  const socketsInRoom = await io.in(room).fetchSockets();
  const userIdsInRoom = [
    ...new Set(
      socketsInRoom.map((socket) => {
        return socket.data.userId;
      }),
    ),
  ];

  io.in(room).emit("online-users", userIdsInRoom);
}

io.on("connection", (socket) => {
  const userId = socket.request.session.userId;
  const { listId } = socket.handshake.auth;

  if (!userId) {
    socket.disconnect();
    return;
  }

  if (!isListMember(userId, listId)) {
    socket.disconnect();
    return;
  }

  setInterval(() => {
    socket.emit("timestamp", Date.now());
  }, 1000);

  socket.data.userId = userId;
  socket.data.listId = listId;
  const room = `list-${listId}`;
  socket.join(room);

  emitOnlineUsers(listId);

  socket.on("disconnect", () => {
    emitOnlineUsers(listId);
    socket.to(room).emit("user-stopped-typing", { userId });
  });

  socket.on("checklist-updated", () => {
    socket.to(room).emit("checklist-updated");
  });

  socket.on("user-is-typing", () => {
    socket.to(room).emit("user-is-typing", { userId });
  });

  socket.on("user-stopped-typing", () => {
    socket.to(room).emit("user-stopped-typing", { userId });
  });
});

import authRouter from "./routers/authRouter.js";
app.use(authRouter);

import usersRouter from "./routers/usersRouter.js";
app.use(usersRouter);

import listsRouter from "./routers/listsRouter.js";
app.use(listsRouter);

import listItemsRouter from "./routers/listItemsRouter.js";
app.use(listItemsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT ?? 8080;

server.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
