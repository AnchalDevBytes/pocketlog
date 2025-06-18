/*
  Warnings:

  - You are about to drop the `NotificationSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "NotificationSettings" DROP CONSTRAINT "NotificationSettings_userId_fkey";

-- DropTable
DROP TABLE "NotificationSettings";
