/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `todo_table` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "todo_table_title_key" ON "todo_table"("title");
