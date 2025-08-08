/*
  Warnings:

  - You are about to drop the `StockPrice` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "StockPrice";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "StockQuote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "symbol" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "StockQuote_symbol_idx" ON "StockQuote"("symbol");
