# Welcome to FiveM Builder

Hello :wave:
This tool was written to make developing typescript based resources for FiveM a lot easier, it's super rough and early stages in it's current state, but will continue to receive updates and improvements.


# Getting Started

1. Clone the repo
2. `yarn`
3. Copy `config.example.json` to `config.json`
4. Modify `config.json` to fit your project directories, I'll have an example project soon
5. Run `yarn watch`
6. Profit :moneybag:

## What does this do?

In the simplest form, this setup is meant to take a raw project folder, watch it for changes, transpile and build as needed, and then push those changes to your FiveM Development Server when required. It will also use FiveM RCON to automatically restart the resource when it has completed the updates. This tool takes advantage of ESBuild to achieve extremely fast build times.

## Contributing

If you wanna make changes, report bugs, etc, all that is more than welcome via the github Pull Request/Issue system.