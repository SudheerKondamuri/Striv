/*
  Warnings:

  - Added the required column `description` to the `Startup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Startup" ADD COLUMN     "description" TEXT NOT NULL;
