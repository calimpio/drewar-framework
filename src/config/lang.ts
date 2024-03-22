export class Lang {
    static Errors = class {
        static required = "field is required.";
        static unique = (value: string) => `${value} allredy exists.`;
        static exists = (value: string) => `${value} is not exists.`;
        static confirm = (field: string, other: string) => `${field} is not the same as ${other}.`;
        static email = `ìs not a email address.`;
        static requiredIf = `field is required.`;
        static type = <T extends { name: string }>(type: T) => `is not a instance of ${type.name}.`;
        static typeStr = (type: string) => `is not a instance of ${type}.`;
    }
}

