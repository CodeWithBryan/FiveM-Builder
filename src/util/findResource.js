const fs = require('fs');
const path = require('path');

const findResource = (resourceFolders, directory) => {
    const files = fs.readdirSync(directory, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    for (let resource of files) {
        if (!resource.match(/\[.*\]/)) {
            resourceFolders[`${Date.now()}-${resource}`] = {
                resource,
                client: "",
                server: "",
                directory: path.join(directory, resource),
            };
        }
    }
}

module.exports = {
    findResource,
}