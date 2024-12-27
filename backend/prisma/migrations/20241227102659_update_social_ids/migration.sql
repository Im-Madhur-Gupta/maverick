/*
  Warnings:

  - The `socialIds` column on the `Agents` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Agents" DROP COLUMN "socialIds",
ADD COLUMN     "socialIds" TEXT[];
