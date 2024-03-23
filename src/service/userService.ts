import { Op } from "sequelize";
import User, { IUser } from "../model/user";
import ErrorMessageDTO, {
    ValidationErrorDTO,
    ValidationErrorsCodeEnum,
    ValidationPropErrorDTO
} from "../dto/errorMessageDTO";
import { PageQuerys } from "../dto/PageDTO";
import { Specificator } from "../util/specificator";
import { INewUserRequestBody, IUserDTO, IUserRolerBody, UserRole } from "../dto/userDTO";
import { UserLoginValidation, UpdateUserValidation } from "../gate/validation/userValidation"
import { Config } from "../config";
import jwt from 'jsonwebtoken'
import { Hash } from "../util/hash";
import { DeviceService } from "./deviceService";
import Device from "../model/device";
import { DeviceType } from "../dto/deviceDTO";
import { findAndCountAll } from "../util/services";


export class UserService {

    static async login(user: UserLoginValidation) {
        try {
            const value = await User.findAll({
                where: {
                    username: user.props.username,
                    password: user.props.password
                }
            });
            if (value.length > 0) {
                if (!value[0].get("deleted")) {
                    const userDTO = value[0].toDTO()
                    userDTO.token = UserService.sign(userDTO);
                    if (userDTO.role >= UserRole.SUPER) {
                        userDTO.apikeys = (await Device.findAll({
                            where: { type: { [Op.ne]: DeviceType.WEB } },
                            logging: Config.Props.IsDev
                        })).map((device) => {
                            const deviceDTO = device.toDTO();
                            deviceDTO.token = DeviceService.sign(deviceDTO);
                            return deviceDTO;
                        })
                    }
                    return userDTO;
                }
            }
        } catch (err) {
            throw new ErrorMessageDTO({
                title: "Error at creating user.",
                origin: "API User Logger",
                description: "Internal server error",
                status: 500,
                errors: (Config.Props.IsDev ? err : null)
            });
        }
        throw new ErrorMessageDTO({
            title: "Error at login user.",
            origin: "API User Logger",
            description: "Bad credentials",
            errors: { type: "BadCredentials" },
            status: 400
        })
    }

    static async createWithRole(params: INewUserRequestBody, role: UserRole) {
        return (await User.create({
            name: params.name,
            lname: params.lname,
            username: params.username,
            password: params.password,
            role: role,
            email: params.email,
        })).toDTO();
    }

    static async create(userStore: INewUserRequestBody) {
        try {
            const user = await UserService._create(userStore);
            const userDTO = user.toDTO()
            return userDTO;
        } catch (err) {
            throw new ErrorMessageDTO({
                title: "Error at creating user.",
                origin: "API User Creator",
                description: "Internal server error",
                status: 500,
                errors: (Config.Props.IsDev ? err : null)
            });
        }
    }

    static async createAndLogin(userStore: INewUserRequestBody) {
        try {
            const user = await UserService._create(userStore);
            const userDTO = user.toDTO()
            userDTO.token = UserService.sign(userDTO);
            return userDTO;
        } catch (err) {
            throw new ErrorMessageDTO({
                title: "Error at creating user.",
                origin: "API User Creator",
                description: "Internal server error",
                status: 500,
                errors: (Config.Props.IsDev ? err : null)
            });
        }
    }

    static async getAll(querys: PageQuerys) {
        try {
            return await findAndCountAll<IUserDTO>(User, querys, (filter) => {
                return Specificator.where(Specificator.no<IUser>("deleted", true)).and(filter);
            })
        }
        catch (err) {
            console.log(err);
            throw new ErrorMessageDTO({
                title: "Error at creating user.",
                origin: "API User Finder",
                description: "Internal server error",
                status: 500,
                errors: (Config.Props.IsDev ? err : null)
            });
        }
    }

    static async update(user: User, userUpdateDTO: UpdateUserValidation, userAuth: User) {
        const data = userUpdateDTO.props;
        let willUpdate = false;
        if (userAuth.get('role') == UserRole.ADMIN) {
            if (data.role) {
                user.set('role', data.role);
                willUpdate = true;
            }
        } else if (user.get('id') == userAuth.get('id')) {

            if (data.email) {
                user.set('email', data.email);
                willUpdate = true;
            }
            if (data.name) {
                user.set("name", data.name);
                willUpdate = true;
            }
            if (data.lname) {
                user.set("lname", data.lname);
                willUpdate = true;
            }

            if (data.passwords && data.isPasswordWillChange) {
                const passData = data.passwords;
                if (passData.oldPassword !== user.get('password')) {
                    throw new ValidationErrorDTO().addError("passwords.oldPassword",
                        new ValidationPropErrorDTO({
                            field: "passwords.oldPassword",
                            description: "Bad credential.",
                            code: ValidationErrorsCodeEnum.badCredentials
                        }))
                } else if (passData.newPassword == user.get('password')) {
                    throw new ValidationErrorDTO().addError("passwords.oldPassword",
                        new ValidationPropErrorDTO({
                            field: "passwords.oldPassword",
                            description: "passwords.newpassword is the oldpassword.",
                            code: ValidationErrorsCodeEnum.notsame
                        }))
                }
                user.set('password', passData.newPassword);
                willUpdate = true;
            }
            if (willUpdate) {
                user = await user.save({ logging: Config.Props.IsDev });
            }

        }
        if (willUpdate) {
            user = await user.save({ logging: Config.Props.IsDev });
        }
        return user.toDTO()
    }

    static async destroy(user: User) {
        user.set("deleted", true);
        return (await user.save()).get('id')
    }


    static async _create(newUser: INewUserRequestBody) {
        let userCreated!: User;
        const data = await User.findAll({ where: { deleted: true }, limit: 1 });
        if (data.length > 0) {
            userCreated = data[0];
            userCreated.set("username", newUser.username);
            userCreated.set("password", newUser.password);
            userCreated.set("name", newUser.name);
            userCreated.set("email", newUser.email);
            userCreated.set("role", UserRole.GUEST);
            userCreated.set("deleted", false);
            return await userCreated.save({ logging: Config.Props.IsDev });
        }
        return await User.create({
            username: newUser.username,
            password: newUser.password,
            name: newUser.name,
            lname: newUser.lname,
            email: newUser.email,
            role: UserRole.GUEST,
        }, { logging: Config.Props.IsDev })
    }

    static sign(user: IUserRolerBody) {
        return jwt.sign({ username: user.username, role: user.role }, Config.Props.JWT_USER.secret)
    }
}





