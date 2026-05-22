import express from "express";
import { AppDataSource } from "./src/config/data-source";
const app = express();
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("🔥 Database connected (XAMPP)");

    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => {
    console.log("DB Error:", err);
  });