import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: [
    path.join(__dirname, ".env"),
    path.join(__dirname, ".env.test"),
  ],
  override: true,
});
