-- CreateTable
CREATE TABLE "processed_coin_signals" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "strength" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status_id" TEXT,
    "agent_id" TEXT NOT NULL,
    "coin_id" INTEGER NOT NULL,

    CONSTRAINT "processed_coin_signals_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "processed_coin_signals" ADD CONSTRAINT "processed_coin_signals_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processed_coin_signals" ADD CONSTRAINT "processed_coin_signals_coin_id_fkey" FOREIGN KEY ("coin_id") REFERENCES "coins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
