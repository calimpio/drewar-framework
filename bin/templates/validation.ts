import { MakeOptions } from "../types";

export const templateValidation = (model: string, props: string[], options: MakeOptions)=>
`import { ${model}DTO } from "../../dto/${model.toLowerCase()}DTO";
import { IValidable, ValidaterMap, ValidationTypes } from "../../util/validation";


export class Create${model}Validation implements IValidable<${model}DTO>{
    validations:ValidaterMap<${model}DTO> = {
${props.reduce((ac,data) => {
            const prop = data.split('=');
            return ac + `\t\t${prop[0]}: {\n\t\t\ttype: ValidationTypes.${prop[1]}\n\t\t},\n`
        },"")}
    }
    props!: ${model}DTO;

}

export class Update${model}Validation implements IValidable<${model}DTO>{
    validations: ValidaterMap<${model}DTO> = {
${props.reduce((ac,data) => {
            const prop = data.split('=');
            return ac + `\t\t${prop[0]}: {\n\t\t\ttype: ValidationTypes.${prop[1]}\n\t\t},\n`
        },"")}
    }
    props!: ${model}DTO;

}
`