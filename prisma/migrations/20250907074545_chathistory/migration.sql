/*
  Warnings:

  - Added the required column `district` to the `ChatHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `ChatHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `ChatHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `ChatHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `chathistory` ADD COLUMN `district` VARCHAR(50) NOT NULL,
    ADD COLUMN `name` VARCHAR(50) NOT NULL,
    ADD COLUMN `size` VARCHAR(50) NOT NULL,
    ADD COLUMN `weight` INTEGER NOT NULL;
