/*
  Warnings:

  - You are about to drop the column `updated_at` on the `companies` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'MANAGER';

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "updated_at",
ADD COLUMN     "leal_name" TEXT,
ADD COLUMN     "photo" TEXT;
