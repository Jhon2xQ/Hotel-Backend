-- DropForeignKey
ALTER TABLE "muebles" DROP CONSTRAINT "muebles_habitacionId_fkey";

-- AlterTable
ALTER TABLE "muebles" ALTER COLUMN "habitacionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "muebles" ADD CONSTRAINT "muebles_habitacionId_fkey" FOREIGN KEY ("habitacionId") REFERENCES "habitaciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;
