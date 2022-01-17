const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { copyRecursiveSync } = require('../util/copyRecursive');

const generate = (type, directory, name) => {
    let location = process.cwd();
    
    if (fs.existsSync('./resources')) {
        location = path.join(location, 'resources');
    } else {
        return console.error(chalk.red(chalk.bold(chalk.underline('Error!')), 'Must be in the project root'));
    }

    if (["resource", "r"].includes(type.toLowerCase())) {
        const sourceLocation = path.join(__dirname, '../../templates/resource');
        const parent = directory.match(/\[.*\]/) ? directory : `[${directory}]`;
        const distLocation = path.join(location, parent, name);

        if (!fs.existsSync(distLocation)) {
            fs.mkdirSync(distLocation, { recursive: true });
        } else {
            return console.error(chalk.red(chalk.bold(chalk.underline('Error!')), 'Directory already exists'));
        }

        copyRecursiveSync(sourceLocation, distLocation);

        return console.log(chalk.greenBright(chalk.bold(chalk.underline('Success!')), 'Resource Created'));
    }

    if (["nui", "n"].includes(type.toLowerCase())) {
        const sourceLocation = path.join(__dirname, '../../templates/resource');
        const parent = directory.match(/\[.*\]/) ? directory : `[${directory}]`;
        const distLocation = path.join(location, parent, name);

        return console.error(chalk.red(chalk.bold(chalk.underline('Error!')), 'NUI Support not implemented yet'));

        // if (!fs.existsSync(distLocation)) {
        //     fs.mkdirSync(distLocation, { recursive: true });
        // } else {
        //     return console.error(chalk.red(chalk.bold(chalk.underline('Error!')), 'Directory already exists'));
        // }

        // copyRecursiveSync(sourceLocation, distLocation);

        // return console.log(chalk.greenBright(chalk.bold(chalk.underline('Success!')), 'Resource Created'));
    }

}

module.exports = {
    generate,
}