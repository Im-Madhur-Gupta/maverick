/*
  Warnings:

  - Added the required column `owner_address` to the `agents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "agents" ADD COLUMN     "owner_address" TEXT NOT NULL;
