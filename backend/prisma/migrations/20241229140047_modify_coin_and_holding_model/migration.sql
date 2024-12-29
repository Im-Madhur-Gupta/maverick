/*
  Warnings:

  - You are about to drop the column `updated_at` on the `agents` table. All the data in the column will be lost.
  - The primary key for the `coins` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `coins` table. All the data in the column will be lost.
  - You are about to drop the column `symbol` on the `coins` table. All the data in the column will be lost.
  - The primary key for the `holdings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `amount` on the `holdings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[external_id]` on the table `agents` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[base_address]` on the table `coins` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[external_id]` on the table `holdings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `external_id` to the `agents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `base_address` to the `coins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `decimals` to the `coins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pool_address` to the `coins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pool_name` to the `coins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token_name` to the `coins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bought_at` to the `holdings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buying_price_usd` to the `holdings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `curr_price_usd` to the `holdings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dry_run` to the `holdings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `external_id` to the `holdings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_active` to the `holdings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profit_abs_usd` to the `holdings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profit_per_usd` to the `holdings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tokens_bought` to the `holdings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `holdings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "holdings" DROP CONSTRAINT "holdings_coin_id_fkey";

-- AlterTable
ALTER TABLE "agents" DROP COLUMN "updated_at",
ADD COLUMN     "external_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "coins" DROP CONSTRAINT "coins_pkey",
DROP COLUMN "name",
DROP COLUMN "symbol",
ADD COLUMN     "base_address" TEXT NOT NULL,
ADD COLUMN     "decimals" INTEGER NOT NULL,
ADD COLUMN     "pool_address" TEXT NOT NULL,
ADD COLUMN     "pool_name" TEXT NOT NULL,
ADD COLUMN     "token_name" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "coins_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "coins_id_seq";

-- AlterTable
ALTER TABLE "holdings" DROP CONSTRAINT "holdings_pkey",
DROP COLUMN "amount",
ADD COLUMN     "bought_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "buying_price_usd" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "curr_price_usd" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "dry_run" BOOLEAN NOT NULL,
ADD COLUMN     "external_id" TEXT NOT NULL,
ADD COLUMN     "is_active" BOOLEAN NOT NULL,
ADD COLUMN     "profit_abs_usd" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "profit_per_usd" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "tokens_bought" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "coin_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "holdings_pkey" PRIMARY KEY ("agent_id", "coin_id");

-- CreateIndex
CREATE UNIQUE INDEX "agents_external_id_key" ON "agents"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "coins_base_address_key" ON "coins"("base_address");

-- CreateIndex
CREATE UNIQUE INDEX "holdings_external_id_key" ON "holdings"("external_id");

-- AddForeignKey
ALTER TABLE "holdings" ADD CONSTRAINT "holdings_coin_id_fkey" FOREIGN KEY ("coin_id") REFERENCES "coins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
