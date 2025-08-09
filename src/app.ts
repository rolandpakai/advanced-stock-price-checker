import express from "express";
import swaggerUi from "swagger-ui-express";
import stockRoutes from "./routes/stockRoutes";
import { swaggerSpec } from "./config/swagger";

const app = express();

app.use(express.json());
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/stock", stockRoutes);
app.use((_, res) => {
  res.status(404).json({ error: "API route not found" });
});

export default app;