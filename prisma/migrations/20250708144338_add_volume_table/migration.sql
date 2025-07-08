/*
  Warnings:

  - Added the required column `volumeId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "volumeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Volume" (
    "id" SERIAL NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Volume_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_volumeId_fkey" FOREIGN KEY ("volumeId") REFERENCES "Volume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
