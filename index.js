import { Command } from "commander";
import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";
import chalk from "chalk";
import Table from "cli-table3"
import prompts from "prompts"

const program = new Command();
const client = new PrismaClient();

program.name("CLI-TODO-app");
program.version("1.0.0");
program.description("Manage your tasks on the terminal");

const validStatuses = ["todo", "InProgress", "done"];

const addTaskCommand = program.command("add-task");
addTaskCommand.description("Add a task to your todo list");
addTaskCommand.action(async function () {
 const response=await prompts([
  {
    type:"text",
    name:"taskTitle",
    message:"Title of the Task"
  },
  {
    type:"text",
    name:"taskDescription",
    message:"Description of the task"
  },
  {
    type:"text",
    name:"taskStatus",
    message:"Status of the task"
  }
 ])

  if (!validStatuses.includes(response.taskStatus)) {
    console.log(chalk.bgRed(`Invalid status`));
    console.log(chalk.bgYellow(`Status must be one of: todo, InProgress, or done`));
    return;
  }

  try {
  const insertedTask=await client.todo.create({
      data: {
        id: nanoid(4),
        title:response.taskTitle,
        description:response.taskDescription,
        status:response.taskStatus,
      },
    });
    console.log(chalk.green(`New todo Item added successfully🎇🎇`));
    const table=new Table({
      head:["id","Title","Description","Status"]
    })
    table.push([insertedTask.id,insertedTask.title,insertedTask.description,insertedTask.status])
    console.log(table.toString())
  } catch (e) {
    console.log(chalk.bgRed(`There was an error adding new task❌ `));
    console.log(
      chalk.bgYellow(
        `Make sure you have supplied the Task title, description and the status correctly`,
      ),
    );
    console.log(
      chalk.bgYellow(
        `Make sure that the task status is either todo, InProgress or done`,
      ),
    );
  }
});

program.command("read-tasks")
.description("Get all todos or the specified todo item")
.option("-i, --id <value>", "The id of the specific Todo Item")
.action(async function(options){
    const todoID=options.id;
    try {
        if(todoID){
    const foundTask= await client.todo.findFirst({
  where:{
    id:todoID
  }
    })
    if(!foundTask){
    console.log(chalk.bgYellow(`Task with ID ${todoID} was not found`));
    }
        else{
    const table=new Table({
        head: ["ID","Title","Description","Status"]
    })
    table.push([foundTask.id, foundTask.title,foundTask.description,foundTask.status])
    console.log(table.toString());
        }
    
    }else{
        const tasks=await client.todo.findMany();
        const table=new Table({
            head: ["ID","Title","Description","Status"]
        })
        tasks.forEach(function(taskItem){
            table.push([taskItem.id,taskItem.title,taskItem.description,taskItem.status])
        })
        console.log(table.toString());
                }
    } catch (e) {
       console.log(chalk.bgRed(`Error reading todo`)) 
    }
})
 program.command("update-task")
 .description("Updates the specified todo Item")
 .requiredOption("-i, --id <value>","ID of the task you want to update")
 .option("-t, --title <value>","New Title")
 .option("-d, --description <value>","New Description")
 .option("-s, --status <value>","New Status")
 .action(async function(options){
    const id=options.id;
    const newTitle=options.title;
    const newDescription=options.description;
    const newStatus=options.status;

    try {
        await client.todo.update({
            where:{ id},
            data:{
            title:newTitle &&newTitle,
            description:newDescription && newDescription,
            status:newStatus && newStatus
            }
        })
        console.log(chalk.bgGreen(`task has been updated successfully`))
    } catch (e) {
     console.log(chalk.bgRed(`error updating task`))   
    }
 })

 program.command("delete-task")
 .description("delete specific task")
 .requiredOption("-i, --id <value>", "ID of the task to be deleted")
 .action(async function(options){
    const id =options.id;
    try {
        await client.todo.delete({
            where:{id}
        })
        console.log(chalk.bgGreen(`Task deleted successfully`))
    } catch (e) {
       console.log(chalk.bgRed(`Error deletingTask`))
    }
 })
 program.command("delete-all")
 .description("deletes all the Tasks")
 .action( async function(){
console.log(chalk.bgRed(`!!!!HOLD ON THATS A DANGEROUS COMMAND THERE!!!!`))
try {
   const response=await prompts({
    type:"multiselect",
    name:"Decision",
    message:"Are you sure you want to delete all the Todo Tasks?",
    choices:[
      {title:"Yes",value:'yes'},
      {title:"No", value:'no'}
    ]
   })
  if(response.Decision[0]==='yes'){
    await client.todo.deleteMany();
    console.log(chalk.bgGreen(`Successfully deleted all contacts`))
  }
} catch (e) {
  console.log(chalk.bgRed(`There was an error!`))
}
 })
program.parseAsync();
