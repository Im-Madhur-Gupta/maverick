/*
  Warnings:

  - A unique constraint covering the columns `[evm_address]` on the table `agents` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sol_address]` on the table `agents` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "agents_evm_address_key" ON "agents"("evm_address");

-- CreateIndex
CREATE UNIQUE INDEX "agents_sol_address_key" ON "agents"("sol_address");
