
const commandsToBind: { [className: string]: any } = {};

export const Command = (args: any = {}, description?: string) => {
    return (target: any, propertyKey: string, _descriptor: PropertyDescriptor) => {
        const className: string = target.constructor.name;
        commandsToBind[className] = commandsToBind[className] || [];
        commandsToBind[className].push({
            commandName: propertyKey,
            protoArgs: args,
        });

        let commandSuggestion = `${propertyKey}`;
        for(let key in args) {
            commandSuggestion += ` ${key}`;
        }
    }
}

export const CommandHandler = (target: any) => {
    const original = target;

    var replacement : any = function (...args) {
        var _this = new original(...args);
        (commandsToBind[target.prototype.originalName || target.name] || []).forEach((commandDesc) => {
            const { commandName, protoArgs } = commandDesc;

            const binded: Function = _this[commandName].bind(_this);
            RegisterCommand(commandName, async function (src: string, args: any[]) {
                let processedArgs = [];

                args.forEach(arg => {
                    if(protoArgs[0]) {
                        arg = protoArgs[0](arg);
                    }
                    processedArgs.push(arg);
                });

                if (IsDuplicityVersion()) {
                    processedArgs = [src, ...processedArgs];
                }

                binded(...processedArgs);
            }, false);
        });
    }

    replacement.prototype = original.prototype;
    replacement.prototype.name = original.name;
    replacement.interfaceName = target.prototype.name || target.name;
    return replacement;
}
