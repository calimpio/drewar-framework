import { MakeOptions } from "../types";

export const templateModel = (model: string, props: string[], options: MakeOptions = {}) =>
`import { Hash } from "../util/hash";
${options.withDTO?
    `import { I${model}DTO, ${model}DTO } from "../dto/${model.toLowerCase()}DTO";`:""}
import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Optional } from "sequelize";
import { API_DB } from "../config";
import { IDaoToDTO } from "../util/services";

interface I${model} {
    id: bigint;
${props.reduce((ac,data) => {
    const prop = data.split('=');
    return ac + `\t${prop[0]}: ${prop[1]};\n`
},"")}
}

interface ${model}CreationAttributes extends Optional<I${model}, "id">, Omit<I${model}, "id"> { }

@Table({ tableName: "${model.toLowerCase()}s" })
export default class ${model} extends Model<I${
    model}, ${model}CreationAttributes> implements ${options.withDTO?`IDaoToDTO<I${model}DTO>,`:""} I${model} {
    @PrimaryKey
    @Column
    id!: bigint;

${props.reduce((ac, data) => {
    const prop = data.split('=');
    return ac + `\t@Column\n\t${prop[0]}!: ${prop[1]};\n`
},"")}        

    ${options.withDTO?`public alterDTO(data: ${model}DTO) {
        data.id = Hash.encodeId(this.get('id'));       
${props.reduce((ac, data) => {
    const prop = data.split('=');
    return ac + `\t\tdata.${prop[0]} = this.get('${prop[0]}');\n`
},"")}
        data.createdAt = this.get("createdAt");
        data.updatedAt = this.get("updatedAt");
    }

    public toDTO(): ${model}DTO {
        return new ${model}DTO(this);
    }`:""}
}

API_DB.addModels([${model}])
`