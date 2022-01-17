const cli = require('commander');
const { watch } = require('./commands/watch');
const { newCommand } = require('./commands/new');
const { generate } = require('./commands/generate');

export function init(args) {
    cli.description("Fivem Typescript CLI");
    cli.name("fivem");
    cli.usage("<command>");

    cli
        .command("new")
        .alias("n")
        .argument("[Project Name]", "Name of your project")
        .description("Create a new project")
        .action(newCommand);

    cli
        .command("generate")
        .alias("g")
        .argument("[Type]", "resource (r), nui (n)")
        .argument("[Directory]", "A [parent] directory, used for organization")
        .argument("[Name]", "The name of your resource")
        .description("Generate a new resource or nui resource")
        .action(generate);

    cli
        .command("watch")
        .alias("w")
        .description("Start a development server in the current project")
        .action(watch);

    cli.parse(args);
}
