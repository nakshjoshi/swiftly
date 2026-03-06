/*
  Warnings:

  - You are about to drop the column `name` on the `Resume` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Experience" ADD COLUMN     "location" TEXT;

-- AlterTable
ALTER TABLE "Resume" DROP COLUMN "name",
ALTER COLUMN "title" SET DEFAULT 'Resume-1';
