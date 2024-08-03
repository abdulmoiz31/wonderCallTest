-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MessageLike" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "messageId" INTEGER NOT NULL,
    CONSTRAINT "MessageLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MessageLike_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MessageLike" ("id", "messageId", "userId") SELECT "id", "messageId", "userId" FROM "MessageLike";
DROP TABLE "MessageLike";
ALTER TABLE "new_MessageLike" RENAME TO "MessageLike";
CREATE UNIQUE INDEX "MessageLike_messageId_userId_key" ON "MessageLike"("messageId", "userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
