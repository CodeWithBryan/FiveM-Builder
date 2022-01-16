import fs from 'fs';
import path from 'path';
import esbuild from 'esbuild';
import crypto from 'crypto';
import rimraf from 'rimraf';
import time from 'esbuild-plugin-time';

import { findResourceParent, findResource, handleDeploy } from './helpers.mjs';
import rcon from './rcon.js';

import config from '../config.json';

const resourceParents = [];
const resourceFolders = {};

const rconClient = rcon(config.RCON);

// Build a list of parent folders
findResourceParent(resourceParents, path.join(config.SourceFolder, config.ResourcesFolder));

// Build a list of resource folders inside each parent folder
for (let parent of resourceParents) {
    findResource(resourceFolders, parent);
}

// Begin watching
for (let key of Object.keys(resourceFolders)) {
    const { directory } = resourceFolders[key];
    
    try {
        const buildDir = directory.replace(`${config.SourceFolder}\\${config.ResourcesFolder}`, '');
        
        for (let context of [ 'client', 'server' ]) {
            const outputFile = `${config.TemporaryDirectory}/${buildDir}/${context}.js`;
            const sourceFile = path.join(directory, context, 'resource.ts');

            if (fs.existsSync(sourceFile)) {
                esbuild.build({
                    entryPoints: [ sourceFile ],
                    outfile: outputFile,
                    bundle: true,
                    minify: true,
                    plugins: [
                        time(),
                    ],
                    watch: {
                        onRebuild(error, result) {
                            if (error) {
                                console.error('watch build failed:', error)
                                return;
                            }
    
                            const fileBuffer = fs.readFileSync(outputFile);
                            const hashSum = crypto.createHash('sha256');
                            hashSum.update(fileBuffer);
                            const hex = hashSum.digest('hex');
                            
                            if (hex !== resourceFolders[key][context]) {
                                resourceFolders[key][context] = hex;
                                handleDeploy(rconClient, config, resourceFolders, key, buildDir);
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

/*
 * Process Start
 */

// Make sure we've got our temporary cache directory
if (!fs.existsSync(`./${config.TemporaryDirectory}`)) {
    fs.mkdirSync(`./${config.TemporaryDirectory}`);
}

// Clear our old cache
rimraf.sync(`./${config.TemporaryDirectory}/*`);

/* Trigger a deploy on all resources */
for (let key of Object.keys(resourceFolders)) {
    resourceFolders[key].buildStart = Date.now();
    // handleChange(key);
}
