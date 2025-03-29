import {Command} from "commander"
import{PrismaClient} from "@prisma/client"
import {nanoid} from "nanoid"

const program=  new Command();
const client=new PrismaClient();

program.name("CLI-TODO-app")
program.version("1.0.0")
program.description("Manage your tasks on the terminal")

const addTaskCommand=program.command("add-task")
addTaskCommand.description("Add a task to your todo list")
addTaskCommand.requiredOption("-t, --title <value>" ,"The title of the task")
addTaskCommand.requiredOption("-d, --description <value>" ,"Add a description to the task")
addTaskCommand.action(async function(options){
const title=options.title;
const description=options.description;

try{
    const newTask= await client.todo.create({
        data:{
            id:nanoid(4),
            title,
            description
        }
    })
    console.log(newTask)
}catch(e){
console.log("There was an error adding new task")
}
})


program.parseAsync();