const fs = require('fs');
const path = require('path');

const findResourceParent = (resourceParents, directory) => {
    const files = fs.readdirSync(directory);

    //listing all files using forEach
    files.forEach(function (file) {
        if (file.match(/\[.*\]/)) {
            const filepath = path.join(directory, file.toString());
            resourceParents.push(filepath);

            // Search for children
            findResourceParent(resourceParents, filepath);
        }
    });
}

module.exports = {
    findResourceParent,
}