import { Hash } from "../util/hash";
import { IUserDao, UserDTO, UserRole } from "../dto/userDTO";
import { Column, DataType, Model, NotNull, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { Optional } from "sequelize";
import { API_DB } from "../config";

export interface IUser {
    id: string,
    email: string,
    username: string,
    role?: UserRole,
    name: string,
    lname: string,
    password?: string,
    createdAt?: string,
    updatedAt?: string,
    deleted?: boolean,
}


interface UserCreationAttributes extends Optional<IUser, "id">, Omit<IUser, "id"> { }

@Table({ tableName: "users" })
export default class User extends Model<IUser, UserCreationAttributes> implements IUserDao, IUser {
    @PrimaryKey
    @Column
    id!: string;

    @Column
    email!: string;

    @Column
    username!: string;

    @Column
    role!: UserRole;

    @Column
    name!: string;

    @Column
    lname!: string;

    @Column
    password!: string;

    @Column
    deleted!: boolean;    

    public alterDTO(data: UserDTO) {
        data.id = this.get('id');
        data.email = this.get("email");
        data.name = this.get('name');
        data.username = this.get('username');
        data.lname = this.get('lname');
        data.role = this.get('role');
        data.createdAt = this.get("createdAt");
        data.updatedAt = this.get("updatedAt");
    }

    public toDTO() {
        return new UserDTO(this);
    }

    getRole(){
        return this.get("role")
    }

}

API_DB.addModels([User])