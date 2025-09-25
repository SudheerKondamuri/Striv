/*
  Warnings:

  - You are about to drop the column `metadata` on the `Deal` table. All the data in the column will be lost.
  - You are about to drop the column `Phoneno` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phoneno]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."User_Phoneno_key";

-- AlterTable
ALTER TABLE "public"."Deal" DROP COLUMN "metadata",
ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "public"."Startup" ADD COLUMN     "pitchLogo" TEXT,
ADD COLUMN     "pitchThumbNail" TEXT;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "Phoneno",
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "phoneno" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneno_key" ON "public"."User"("phoneno");
