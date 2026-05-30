import express from "express";

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

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

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

const activeUsers = new Map();

io.on("connection", (socket) => {
  const { userId } = socket.handshake.auth;
  activeUsers.set(socket.id, userId);

  socket.broadcast.emit("user-connected", { userId });

  socket.emit("user-list", [...activeUsers.values()]);

  socket.on("disconnect", () => {
    activeUsers.delete(socket.id);
    io.emit("user-disconnected", { userId });
  });

  socket.on("checklist-updated", () => {
    socket.broadcast.emit("checklist-updated")
  })
});

import authRouter from "./routers/authRouter.js";
app.use(authRouter);

import usersRouter from "./routers/usersRouter.js";
app.use(usersRouter);

import listsRouter from "./routers/listsRouter.js";
app.use(listsRouter);

import listItemsRouter from "./routers/listItemsRouter.js";
app.use(listItemsRouter);

const PORT = process.env.PORT ?? 8080;

server.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
