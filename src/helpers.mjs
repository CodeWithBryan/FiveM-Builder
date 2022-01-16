import fs from 'fs';
import path from 'path';

export const findResourceParent = (resourceParents, directory) => {
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

export const findResource = (resourceFolders, directory) => {
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

export const handleDeploy = (rconClient, config, resourceFolders, key, buildDir) => {
    const deployPath = path.join(config.DeployFolder, buildDir);
    
    // Make sure we've got our deploy directory
    if (fs.existsSync(deployPath)) {
        try {
            fs.rmdirSync(deployPath, { recursive: true });
        } catch (err) {
            console.error(`Error while deleting ${deployPath}.`);
        }
    }
    
    // Create our fresh directory
    fs.mkdirSync(deployPath, { recursive: true });
    
    for (let context of [ 'client', 'server' ]) {
        const builtFile = `${config.TemporaryDirectory}/${buildDir}/${context}.js`;
        fs.copyFileSync(builtFile, `${deployPath}/${context}.js`);
    }
    
    rconClient.send(`refresh; ensure ${resourceFolders[key].resource}`);

    console.log(`Built Resource: ${resourceFolders[key].resource}`);
}