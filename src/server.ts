// -------------------- Imports ------------------------------
import express, { Express } from "express";
import dotenv from "dotenv";

// -------------------- Server init --------------------------

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3001;

// ------------------- Middlewares  --------------------------
// ------------------- Server start --------------------------

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
