/*
  Warnings:

  - You are about to drop the `todo_table` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "todo_table";

-- CreateTable
CREATE TABLE "todos_table" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'todo',

    CONSTRAINT "todos_table_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "todos_table_title_key" ON "todos_table"("title");
