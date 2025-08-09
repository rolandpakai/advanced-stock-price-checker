/*
  Warnings:

  - You are about to drop the column `price` on the `StockQuote` table. All the data in the column will be lost.
  - Added the required column `currentPrice` to the `StockQuote` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StockQuote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "symbol" TEXT NOT NULL,
    "currentPrice" REAL NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_StockQuote" ("createdAt", "id", "symbol", "timestamp") SELECT "createdAt", "id", "symbol", "timestamp" FROM "StockQuote";
DROP TABLE "StockQuote";
ALTER TABLE "new_StockQuote" RENAME TO "StockQuote";
CREATE INDEX "StockQuote_symbol_idx" ON "StockQuote"("symbol");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
