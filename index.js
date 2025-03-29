import { Command } from "commander";
import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";
import chalk from "chalk";

const program = new Command();
const client = new PrismaClient();

program.name("CLI-TODO-app");
program.version("1.0.0");
program.description("Manage your tasks on the terminal");

const addTaskCommand = program.command("add-task");
addTaskCommand.description("Add a task to your todo list");
addTaskCommand.requiredOption("-t, --title <value>", "The title of the task");
addTaskCommand.requiredOption(
  "-d, --description <value>",
  "Add a description to the task",
);
addTaskCommand.action(async function (options) {
  const title = options.title;
  const description = options.description;

  try {
 await client.todo.create({
      data: {
        id: nanoid(4),
        title,
        description,
      },
    });
    console.log(chalk.green(`New todo Item added successfully🎇🎇`));
  } catch (e) {
    console.log(chalk.bgRed(`There was an error adding new task❌ `));
    console.log(
      chalk.bgYellow(
        `Make sure you have supplied the Task title, description and the status`,
      ),
    );
    console.log(
      chalk.bgYellow(
        `Make sure that the task status is either todo, InProgress or done`,
      ),
    );
  }
});

program.parseAsync();
