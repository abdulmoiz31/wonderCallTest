/*
  Warnings:

  - A unique constraint covering the columns `[messageId,userId]` on the table `MessageLike` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MessageLike_messageId_userId_key" ON "MessageLike"("messageId", "userId");
