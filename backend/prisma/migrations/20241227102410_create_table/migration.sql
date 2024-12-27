-- CreateTable
CREATE TABLE "Agents" (
    "name" VARCHAR NOT NULL,
    "id" UUID NOT NULL,
    "persona" INTEGER NOT NULL,
    "socialIds" VARCHAR NOT NULL,

    CONSTRAINT "Agents_pkey" PRIMARY KEY ("id")
);
