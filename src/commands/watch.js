const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const esbuild = require('esbuild');
const crypto = require('crypto');
const rcon = require('../util/rcon');

const { findResource } = require('../util/findResource');
const { findResourceParent } = require('../util/findResourceParent');

const watch = (...args) => {
    const config = loadConfig();
    if (!config) return;

    if (config.DeployFolder === '') {
        return console.error(chalk.red(chalk.bold(chalk.underline('Error!')), 'Deploy Folder not defined in config! Modify your config.json'));
    }

    const rconClient = rcon(config.RCON);

    const resourceParents = [];
    const resourceFolders = {};

    // Build our resource list
    findResourceParent(resourceParents, path.join(config.SourceFolder, config.ResourcesFolder));
    for (let parent of resourceParents) {
        findResource(resourceFolders, parent);
    }

    // Watch all the resources
    for (let key of Object.keys(resourceFolders)) {
        const { directory } = resourceFolders[key];
        
        try {
            const buildDir = directory.replace(`${config.SourceFolder}\\${config.ResourcesFolder}`, '');
            
            for (let context of [ 'client', 'server' ]) {
                const sourceFile = path.join(directory, context, 'resource.ts');
                const outputFile = path.join(config.DeployFolder, buildDir, `${context}.js`);
                const { resource } = resourceFolders[key];
    
                if (fs.existsSync(sourceFile)) {
                    esbuild.build({
                        entryPoints: [ sourceFile ],
                        outfile: outputFile,
                        bundle: true,
                        minify: true,
                        plugins: [
                            buildTimePlugin(resource),
                        ],
                        watch: {
                            onRebuild(error, result) {
                                const deployPath = path.join(config.DeployFolder, buildDir);

                                if (error) {
                                    return console.error(chalk.red(chalk.bold(chalk.underline('Error!')), 'Resource compilation failed!'));
                                }
        
                                const fileBuffer = fs.readFileSync(outputFile);
                                const hashSum = crypto.createHash('sha256');
                                hashSum.update(fileBuffer);
                                const hex = hashSum.digest('hex');
                                
                                if (hex !== resourceFolders[key][context]) {
                                    resourceFolders[key][context] = hex;

                                    const deployedFxManifest = path.join(deployPath, 'fxmanifest.lua');
                                    if (!fs.existsSync(deployedFxManifest)) {
                                        // Deploy the fx manifest
                                        fs.writeFileSync(deployedFxManifest, generateFxManifest(resource, config.Author));
                                    }
    
                                    rconClient.send(`refresh; ensure ${resource}`);
                                    
                                    console.log(chalk.greenBright(chalk.bold(chalk.underline('Success!')), `"${resource}" Resource Restarted`));
                                }
                            },
                        },
                    });
                }
                
            }
        } catch (err) {
            console.log(err);
        }
    }
}

const loadConfig = () => {
    const location = process.cwd();
    const file = path.join(location, 'config.json');
    
    if (!fs.existsSync(file)) {
        return console.error(chalk.red(chalk.bold(chalk.underline('Error!')), 'Config file doesn\'t exist in this directory.'));
    }

    return JSON.parse(fs.readFileSync(file));
}

const generateFxManifest = (name, author) => {
    const sourceLocation = path.join(__dirname, '../../templates/fxmanifest.lua');
    const fx = fs.readFileSync(sourceLocation).toString();
    return fx.replace('{name}', name).replace('{author}', author);
}

const buildTimePlugin = (resource) => {
    let buildStartTime;
    let envPlugin = {
        name: 'env',
        setup(build) {
            build.onStart(() => {
                buildStartTime = Date.now();
            }),
            build.onEnd(result => {
                console.log(chalk.grey(chalk.bold(chalk.underline('ESBuild:')), `"${resource}" built in ${Date.now() - buildStartTime}ms`));
            })
        },
    }
    return envPlugin;
}

module.exports = {
    watch,
}
