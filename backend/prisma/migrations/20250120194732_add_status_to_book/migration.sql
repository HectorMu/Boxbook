/*
  Warnings:

  - Added the required column `status` to the `UserBook` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserBook" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fk_user" INTEGER NOT NULL,
    "author" TEXT,
    "title" TEXT,
    "pageCount" INTEGER NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "publishedDae" TEXT NOT NULL,
    "review" TEXT NOT NULL,
    "reviewDate" TEXT NOT NULL,
    "googleBookId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "UserBook_fk_user_fkey" FOREIGN KEY ("fk_user") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserBook" ("author", "fk_user", "googleBookId", "id", "pageCount", "publishedDae", "publisher", "review", "reviewDate", "thumbnail", "title") SELECT "author", "fk_user", "googleBookId", "id", "pageCount", "publishedDae", "publisher", "review", "reviewDate", "thumbnail", "title" FROM "UserBook";
DROP TABLE "UserBook";
ALTER TABLE "new_UserBook" RENAME TO "UserBook";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
