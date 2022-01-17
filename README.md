# Welcome to FiveM Builder
Hello :wave:

This tool was written to make developing typescript based resources for FiveM a lot easier, it's super rough and early stages in it's current state, but will continue to receive updates and improvements.

# Getting Started

1. `npm i fivem-builder -g`
2.  use the `fivem` CLI

### Creating a new project
**`fivem new [project name]`**

This will create a folder in your current directory containing the resource structure, as well as everything you need to get started on a new project. The only other thing you need to do is plugin in the directory of your development server resources folder into the generated config.json file.

For automated reloading of resources, you also need to add rcon to your server config. To use all the default values, simply add `rcon_password rconpassword` to your cfx server.cfg. You can modify the rcon password in the `config.json` in the root of your project.
  

## What does this do?

In the simplest form, this is a CLI that helps you manage your Typescript FiveM Resources in an external development environment with blazing fast hot reloading. It allows you to generate resources using an easy to use cli.

## Limitations
- Currently this doesn't support any NUI
- This system requires that all your client/server code is in respective folders, with the entry file being named `resource.ts` for both.

### Plans for expansion
 - Add NUI support, for Angular, React, and Vue respectively with automatic resource generation commands for each.
 - Expand the ESBuild infrastructure to manage automatic building of NUI Resources
 - More shit...

## Contributing
If you wanna make changes, report bugs, etc, all that is more than welcome via the github Pull Request/Issue system.