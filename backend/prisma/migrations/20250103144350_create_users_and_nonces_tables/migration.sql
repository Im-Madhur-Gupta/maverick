/*
  Warnings:

  - You are about to drop the column `owner_address` on the `agents` table. All the data in the column will be lost.
  - The primary key for the `coins` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `coins` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `holdings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `owner_id` to the `agents` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `coin_id` on the `holdings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "holdings" DROP CONSTRAINT "holdings_coin_id_fkey";

-- AlterTable
ALTER TABLE "agents" DROP COLUMN "owner_address",
ADD COLUMN     "owner_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "coins" DROP CONSTRAINT "coins_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "coins_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "holdings" DROP CONSTRAINT "holdings_pkey",
DROP COLUMN "coin_id",
ADD COLUMN     "coin_id" INTEGER NOT NULL,
ADD CONSTRAINT "holdings_pkey" PRIMARY KEY ("agent_id", "coin_id");

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "solana_address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nonces" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "nonces_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_solana_address_key" ON "users"("solana_address");

-- AddForeignKey
ALTER TABLE "nonces" ADD CONSTRAINT "nonces_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agents" ADD CONSTRAINT "agents_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holdings" ADD CONSTRAINT "holdings_coin_id_fkey" FOREIGN KEY ("coin_id") REFERENCES "coins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
