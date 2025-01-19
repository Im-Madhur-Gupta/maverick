/*
  Warnings:

  - You are about to drop the column `evm_address` on the `agents` table. All the data in the column will be lost.
  - You are about to drop the column `sol_address` on the `agents` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[solana_address]` on the table `agents` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `solana_address` to the `agents` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "agents_evm_address_key";

-- DropIndex
DROP INDEX "agents_sol_address_key";

-- AlterTable
ALTER TABLE "agents" DROP COLUMN "evm_address",
DROP COLUMN "sol_address",
ADD COLUMN     "solana_address" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "agents_solana_address_key" ON "agents"("solana_address");
