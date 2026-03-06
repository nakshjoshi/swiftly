/*
  Warnings:

  - Added the required column `type` to the `Experience` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ExperienceType" AS ENUM ('INTERNSHIP', 'FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'RESEARCH', 'VOLUNTEER');

-- AlterTable
ALTER TABLE "Experience" ADD COLUMN     "type" "ExperienceType" NOT NULL;
