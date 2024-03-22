import { MakeOptions } from "../types";

export const templateService = (model: string, props: string[], options: MakeOptions = {}) =>
    `import { Config } from "../config";
${options.withModel ? `import ${model} from "../model/${model.toLocaleLowerCase()}"` : ""};
import User from "../model/user";
${options.withDTO ?
        `import { ${model}DTO, I${model}DTO } from "../dto/${model.toLocaleLowerCase()}DTO";` : ""}
import ErrorMessageDTO from "../dto/errorMessageDTO";
import { PageQuerys } from "../dto/PageDTO";
import Device from "../model/device";
import { Specificator } from "../util/specificator";
import { findAndCountAll } from "../util/services";

export class ${model}Service {

    static async create(${model.toLocaleLowerCase()}DTO: I${model}DTO, user?: User, models?: { [name: string]: any; }, auth?: Device) {
        try {
            return (await ${model}.create({
${props.reduce((ac, data) => {
            const prop = data.split('=');
            ac += `\t\t\t\t${prop[0]}: ${model.toLocaleLowerCase()}DTO.${prop[0]},\n`
            return ac;
        }, "")}                
            }, { logging: Config.Props.IsDev })).toDTO();
        } catch (err) {
            throw new ErrorMessageDTO({ 
                title: "Error at creating ${model.toLocaleLowerCase()}", 
                origin: "API ${model.toLocaleLowerCase()} Create", 
                description: "server error", 
                status: 500 
            })
        }
    }

    static async getAll(querys: PageQuerys, 
        user?: User | undefined, 
        models?: { [name: string]: any; } | undefined, auth?: Device | undefined) {
        try {
            return await findAndCountAll<I${model}DTO>(${model}, querys);
        } catch (err) {
            if (err instanceof Specificator.Exception.NotMatchSpecificator) {
                throw new ErrorMessageDTO({ 
                    title: "Error at searching ${model.toLocaleLowerCase()}s", 
                    origin: "API ${model.toLocaleLowerCase()} filter", 
                    description: "Filter has errors", 
                    errors: err, 
                    status: 401 
                })
            }
            Config.Props.IsDev ? console.log(err) : null;
            throw new ErrorMessageDTO({ 
                title: "Error at searching ${model.toLocaleLowerCase()}s", 
                origin: "API ${model.toLocaleLowerCase()} Searching", 
                description: "server error", 
                status: 500 
            })
        }
    }

    static async update(data: ${model}DTO, 
        user?: User | undefined, 
        models?: { [name: string]: any; } | undefined, auth?: Device | undefined) {
        try {
            if (models && models.${model.toLocaleLowerCase()} instanceof ${model}) {
                const ${model.toLocaleLowerCase()} = models.${model.toLocaleLowerCase()};
${props.reduce((ac, data) => {
            const prop = data.split('=');
            ac += `\t\t\t\t${model.toLocaleLowerCase()}.${prop[0]} = data.${prop[0]};\n`;
            return ac;
        }, "")}
                return (await ${model.toLocaleLowerCase()}.save({ logging: Config.Props.IsDev })).toDTO();
            }
        } catch (err) {
            throw new ErrorMessageDTO({ title: "Error at updating ${model.toLocaleLowerCase()}s", 
                origin: "API ${model.toLocaleLowerCase()} Update", 
                    description: "server error", 
                    status: 500 
                })
        }
    }

    static async get(user?: User | undefined, 
        models?: { [name: string]: any; } | undefined, 
        auth?: Device | undefined) {
        try {
            if (models && models.${model.toLocaleLowerCase()} instanceof ${model}) {
                return models.${model.toLocaleLowerCase()}.toDTO();
            }
        } catch (err) {
            throw new ErrorMessageDTO({ 
                title: "Error at get ${model.toLocaleLowerCase()}s", 
                origin: "API discipline Get", 
                description: "server error", 
                status: 500 
            })
        }
    }
    
    static async destroy(user: User | undefined, 
        models?: { [name: string]: any; } | undefined, 
        auth?: Device | undefined) {
            try {
                if (models && models.${model.toLocaleLowerCase()} instanceof ${model}) {
                    const ${model.toLocaleLowerCase()} = models.${model.toLocaleLowerCase()};
                    await ${model.toLocaleLowerCase()}.destroy({ logging: Config.Props.IsDev });
                    return true;
                }else {
                    return false;
                }
            } catch (err) {
                throw new ErrorMessageDTO({ title: "Error at updating ${model.toLocaleLowerCase()}s", 
                    origin: "API ${model.toLocaleLowerCase()} Update", 
                        description: "server error", 
                        status: 500 
                    })
            }
    }
}
`