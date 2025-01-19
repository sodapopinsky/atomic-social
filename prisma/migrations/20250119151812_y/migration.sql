/*
  Warnings:

  - You are about to drop the column `submittedBy` on the `Image` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Image` DROP COLUMN `submittedBy`,
    ADD COLUMN `firstName` VARCHAR(191) NOT NULL,
    ADD COLUMN `lastName` VARCHAR(191) NOT NULL;
