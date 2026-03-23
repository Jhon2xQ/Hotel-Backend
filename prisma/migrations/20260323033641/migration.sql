/*
  Warnings:

  - Made the column `habitacionId` on table `muebles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "muebles" ALTER COLUMN "habitacionId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "muebles" ADD CONSTRAINT "muebles_habitacionId_fkey" FOREIGN KEY ("habitacionId") REFERENCES "habitaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
