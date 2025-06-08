/*
  Warnings:

  - You are about to drop the column `photo` on the `companies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "companies" DROP COLUMN "photo",
ADD COLUMN     "photo_id" TEXT;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "attachments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
