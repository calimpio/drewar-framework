import { SequelizeOptions } from "sequelize-typescript";
import { APIProfileEnum } from ".";

export const Migrations: Record<APIProfileEnum, SequelizeOptions & { loggin?: boolean }> = {
  "development": {
    "username": "root",
    "password": "",
    "database": "drewar_dev",
    "host": "127.0.0.1",
    "dialect": "mysql",
  },
  "test": {
    "username": "root",
    "password": "",
    "database": "drewar_test",
    "host": "127.0.0.1",
    "dialect": "mysql",

  },
  "production": {
    "username": "root",
    "password": "",
    "database": "drewar_pro",
    "host": "127.0.0.1",
    "dialect": "mysql",
  }
}
