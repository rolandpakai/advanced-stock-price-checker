import express from "express";
import stockRoutes from "./routes/stockRoutes";

const app = express();

app.use(express.json());
app.use("/stock", stockRoutes);
app.use("/*", (_, res) => {
  res.status(404).json({ error: "API route not found" });
});

export default app;