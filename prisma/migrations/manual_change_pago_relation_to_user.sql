-- Manual migration: Change Pago relation from Personal to User
-- This migration changes the foreign key constraint on the pagos table
-- from referencing personal(id) to referencing user(id)

-- Step 1: Drop the existing foreign key constraint
ALTER TABLE "pagos" DROP CONSTRAINT IF EXISTS "pagos_recibidoPorId_fkey";

-- Step 2: Add the new foreign key constraint referencing user table
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_recibidoPorId_fkey" 
  FOREIGN KEY ("recibidoPorId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Note: This migration assumes that:
-- 1. The recibidoPorId column already exists in the pagos table
-- 2. Any existing recibidoPorId values in pagos table should be updated to reference user IDs
--    instead of personal IDs before running this migration
-- 3. If there are existing pagos with recibidoPorId values that don't exist in the user table,
--    those values should be set to NULL or updated to valid user IDs first
