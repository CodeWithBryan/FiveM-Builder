const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');
const { copyRecursiveSync } = require('../util/copyRecursive');

const newCommand = (name) => {
    const location = path.join(process.cwd(), name);
    const sourceLocation = path.join(__dirname, '../../templates/project');

    if (!fs.existsSync(location)) {
        fs.mkdirSync(location, { recursive: true });
    } else {
        return console.error(chalk.red(chalk.bold(chalk.underline('Error!')), 'Directory already exists'));
    }

    copyRecursiveSync(sourceLocation, location);

    updateJson(path.join(sourceLocation, 'package.json'), { name });
    updateJson(path.join(sourceLocation, 'config.json'), { SourceFolder: location });

    console.log(chalk.yellow('Installing CFX Packages ...'));
    execSync(`cd ${name} && git init && npm i @citizenfx/client@latest @citizenfx/server@latest --save`);
    console.log(chalk.greenBright('Completed project setup!'));
}

const updateJson = (file, changes) => {
    const data = JSON.parse(fs.readFileSync(file));
    fs.writeFileSync(file, JSON.stringify({
        ...data,
        ...changes,
    }, null, 2));
}

module.exports = {
    newCommand,
}