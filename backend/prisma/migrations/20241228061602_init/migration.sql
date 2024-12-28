-- CreateTable
CREATE TABLE "agents" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "persona" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coins" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,

    CONSTRAINT "coins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "holdings" (
    "agent_id" INTEGER NOT NULL,
    "coin_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "holdings_pkey" PRIMARY KEY ("agent_id","coin_id")
);

-- AddForeignKey
ALTER TABLE "holdings" ADD CONSTRAINT "holdings_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holdings" ADD CONSTRAINT "holdings_coin_id_fkey" FOREIGN KEY ("coin_id") REFERENCES "coins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
