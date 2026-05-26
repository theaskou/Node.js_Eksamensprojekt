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

import authCheckRouter from "./routers/authCheckRouter.js"
app.use(authCheckRouter);

import loginRouter from "./routers/loginRouter.js";
app.use(loginRouter);

import signUpRouter from "./routers/signUpRouter.js";
app.use(signUpRouter);

import logoutRouter from "./routers/logoutRouter.js";
app.use(logoutRouter);

import usersRouter from "./routers/usersRouter.js"
app.use(usersRouter);

import usersListsRouter from "./routers/usersListsRouter.js";
app.use(usersListsRouter);

import listsRouter from "./routers/listsRouter.js";
app.use(listsRouter);

import listItemsRouter from "./routers/listItemsRouter.js";
app.use(listItemsRouter);

import addListItemRouter from "./routers/addItemRouter.js";
app.use(addListItemRouter);

import verifyEmailRouter from "./routers/verifyEmailRouter.js";
app.use(verifyEmailRouter);

const PORT = process.env.PORT ?? 8080;

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
