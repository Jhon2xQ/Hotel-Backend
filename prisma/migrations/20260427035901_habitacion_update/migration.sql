/*
  Warnings:

  - You are about to drop the column `tieneBanio` on the `habitaciones` table. All the data in the column will be lost.
  - You are about to drop the column `tieneDucha` on the `habitaciones` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "habitaciones" DROP COLUMN "tieneBanio",
DROP COLUMN "tieneDucha",
ADD COLUMN     "amenities" TEXT,
ADD COLUMN     "feature" TEXT;
