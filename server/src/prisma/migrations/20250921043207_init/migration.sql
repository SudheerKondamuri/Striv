/*
  Warnings:

  - A unique constraint covering the columns `[Phoneno]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "DOB" TIMESTAMP(3),
ADD COLUMN     "Phoneno" TEXT,
ADD COLUMN     "address" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "profilePic" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_Phoneno_key" ON "public"."User"("Phoneno");
