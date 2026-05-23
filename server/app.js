import express from "express";

const app = express();

import helmet from "helmet";
app.use(helmet());




const PORT = process.env.PORT ?? 8080;

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
