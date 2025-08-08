import express from "express";
import { getStock, startStockJob, stopStockJob } from "./controllers/stockController";

const router = express.Router();

router.get("/:symbol", getStock);
router.put("/:symbol", startStockJob);
router.delete("/:symbol", stopStockJob);

export default router;
