/*
  Warnings:

  - A unique constraint covering the columns `[userId,provider]` on the table `AuthAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "AuthAccount_provider_passwordHash_key";

-- DropIndex
DROP INDEX "AuthAccount_provider_providerId_key";

-- CreateIndex
CREATE UNIQUE INDEX "AuthAccount_userId_provider_key" ON "AuthAccount"("userId", "provider");
