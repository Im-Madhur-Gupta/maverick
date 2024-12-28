/*
  Warnings:

  - The primary key for the `agents` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `holdings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `description` to the `agents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evm_address` to the `agents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sol_address` to the `agents` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "holdings" DROP CONSTRAINT "holdings_agent_id_fkey";

-- AlterTable
ALTER TABLE "agents" DROP CONSTRAINT "agents_pkey",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "evm_address" TEXT NOT NULL,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sol_address" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "agents_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "agents_id_seq";

-- AlterTable
ALTER TABLE "holdings" DROP CONSTRAINT "holdings_pkey",
ALTER COLUMN "agent_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "holdings_pkey" PRIMARY KEY ("agent_id", "coin_id");

-- AddForeignKey
ALTER TABLE "holdings" ADD CONSTRAINT "holdings_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
