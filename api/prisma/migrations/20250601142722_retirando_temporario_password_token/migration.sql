/*
  Warnings:

  - You are about to drop the `password_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "password_tokens" DROP CONSTRAINT "password_tokens_user_id_fkey";

-- DropTable
DROP TABLE "password_tokens";
