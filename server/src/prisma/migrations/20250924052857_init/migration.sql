/*
  Warnings:

  - You are about to drop the column `notes` on the `Deal` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `pitchDeckPdf` on the `Startup` table. All the data in the column will be lost.
  - You are about to drop the column `pitchDeckVideo` on the `Startup` table. All the data in the column will be lost.
  - You are about to drop the column `DOB` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Deal" DROP COLUMN "notes",
ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "public"."Event" DROP COLUMN "description",
ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "public"."Startup" DROP COLUMN "pitchDeckPdf",
DROP COLUMN "pitchDeckVideo",
ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "DOB",
DROP COLUMN "address",
DROP COLUMN "bio",
DROP COLUMN "gender",
DROP COLUMN "location",
ADD COLUMN     "metadata" JSONB;
