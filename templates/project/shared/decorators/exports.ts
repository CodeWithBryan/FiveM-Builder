let functionsToExport: any = {};
let paramsToExport: any = {};

export const exportF = (includeClassname: boolean = false) => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const className: string = target.constructor.name;
        const eventName = includeClassname ? `${className}:${propertyKey}` : propertyKey;
        functionsToExport[className] = functionsToExport[className] || [];
        functionsToExport[className].push([propertyKey, eventName]);
    }
}

export const exportV = (target: any, memberName: string) => {
    const className: string = target.constructor.name;
    paramsToExport[className] = paramsToExport[className] || [];
    paramsToExport[className].push(memberName);
};

export const hasExports = (target: any) => {
    const original = target;

    var replacement: any = function (...args) {
        var _this = new original(...args);

        (functionsToExport[target.interfaceName || target.prototype.name || target.name] || []).forEach((eventDesc) => {
            const binded: Function = _this[eventDesc[0]].bind(_this);
            exports(eventDesc[1], (...args) => {
                return binded(...args);
            });
        });

        (paramsToExport[target.interfaceName || target.prototype.name || target.name] || []).forEach((variable) => {
            exports(variable, () => {
                return _this[variable];
            });
        });

        return _this;
    }

    replacement.prototype = original.prototype;
    return replacement;
}
