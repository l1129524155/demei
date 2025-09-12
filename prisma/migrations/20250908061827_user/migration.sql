/*
  Warnings:

  - Added the required column `company` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `job` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `company` INTEGER NOT NULL,
    ADD COLUMN `job` INTEGER NOT NULL;
