/*
  Warnings:

  - A unique constraint covering the columns `[provider,passwordHash]` on the table `AuthAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AuthAccount_provider_passwordHash_key" ON "AuthAccount"("provider", "passwordHash");
