import express from "express";
import { getStock, startStockJob, stopStockJob } from "../controllers/stockController";

const router = express.Router();

/**
 * @openapi
 * /stock/{symbol}:
 *   get:
 *     summary: Get the latest stock price, last updated time, and moving average
 *     tags:
 *       - Stock
 *     parameters:
 *       - name: symbol
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Stock ticker symbol (e.g., AAPL)
 *     responses:
 *       200:
 *         description: Successfully retrieved stock data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 symbol:
 *                   type: string
 *                   example: AAPL
 *                 currentPrice:
 *                   type: number
 *                   example: 220.03
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-08-08T12:34:56.000Z"
 *                 movingAverage:
 *                   type: number
 *                   example: 218.45
 *       404:
 *         description: No stock data found for symbol
 *       500:
 *         description: Failed to get stock data
 */
router.get("/:symbol", getStock);
/**
 * @openapi
 * /stock/{symbol}:
 *   put:
 *     summary: Start scheduled stock quote fetching for a given symbol
 *     tags:
 *       - Stock
 *     parameters:
 *       - name: symbol
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Stock ticker symbol
 *     responses:
 *       201:
 *         description: Started scheduled job for symbol
 *       409:
 *         description: Scheduled job already running for 
 */
router.put("/:symbol", startStockJob);
/**
 * @openapi
 * /stock/{symbol}:
 *   delete:
 *     summary: Stop scheduled stock quote fetching for a given symbol
 *     tags:
 *       - Stock
 *     parameters:
 *       - name: symbol
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Stock ticker symbol
 *     responses:
 *       200:
 *         description: Stopped scheduled job for symbol
 *       404:
 *         description: No scheduled job found for symbol
 */
router.delete("/:symbol", stopStockJob);

export default router;
