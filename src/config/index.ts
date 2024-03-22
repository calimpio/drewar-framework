
import { Sequelize } from "sequelize-typescript";
import path from 'path';
import { config } from "dotenv";
import { Migrations } from "./migrations";
config({ path: path.join(__dirname, '../.env') })

export enum APIProfileEnum {
    DEV = "development",
    TEST = "test",
    PROD = "production"
}

export enum HashTypeEnum {
    None = "None",
    Models = "Models",
    Password = "Password"
}


export class Config {

    static Enum = class {
        static APIProfileEnum = {
            DEV: "development",
            TEST: "test",
            PROD: "production"
        }

        static HashTypeEnum = {
            None: "None",
            Models: "Models",
            Password: "Password"
        }
    }

    static Props = class {
        static APP_NAME = "Drewar";
        static API_HEADER = "X-API-KEY";
        static Profile: APIProfileEnum;
        static IsDev: boolean;

        static HashProfiles = {
            [Config.Enum.HashTypeEnum.Models]: {
                salt: process.env.HASH_MODELS_KEY,
                length: 32
            },
            [Config.Enum.HashTypeEnum.Password]: {
                salt: process.env.HASH_PASSWORS_KEY,
                length: 64,
            }
        }

        static JWT_DEVICE: { secret: string } = {
            secret: process.env.JWT_DEVICE_KEY || "jwt_device_sec"
        }
        static JWT_USER: { secret: string } = {
            secret: process.env.JWT_USER_KEY || "jwt_user_sec"
        }

        static WEB = {
            port: 8000,
        }

        static API = {
            port: 8081,
            host: "localhost"
        }
    }
}


Config.Props.Profile = (process.env.PROFILE as APIProfileEnum) || APIProfileEnum.DEV;

Config.Props.IsDev = Config.Props.Profile == Config.Enum.APIProfileEnum.DEV;

const option = Migrations[Config.Props.Profile];
option.loggin = Config.Props.IsDev;
export const API_DB = new Sequelize(option);








