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

import authRouter from "./routers/authRouter.js";
app.use(authRouter);

import usersRouter from "./routers/usersRouter.js";
app.use(usersRouter);

import listsRouter from "./routers/listsRouter.js";
app.use(listsRouter);

import listItemsRouter from "./routers/listItemsRouter.js";
app.use(listItemsRouter);

const PORT = process.env.PORT ?? 8080;

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
