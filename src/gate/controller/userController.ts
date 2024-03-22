import { Validation } from "../../util/validation";
import { NextFunction, Response } from "express";
import ErrorMessageDTO, { ValidationErrorDTO } from "../../dto/errorMessageDTO";
import {
    CreateUserValidation,
    UserLoginValidation,
    UpdateUserValidation
} from "../validation/userValidation";
import { UserService } from "../../service/userService";
import { Specificator } from "../../util/specificator";
import { Config } from "../../config";
import jwt from 'jsonwebtoken'
import User from "../../model/user";
import { Requests } from "../requests";


export class UserController {

    static MiddleWare = class {
        static userAuth(haveTo?: (user: User) => boolean) {
            return async (req: Requests.UserAuth, res: Response, next: NextFunction) => {
                const authStr = req.headers.authorization;
                if (authStr && !req.user) {
                    const token = authStr.split(' ')[1];
                    let doLate!: () => Promise<Response<any, Record<string, any>> | undefined>;
                    jwt.verify(token, Config.Props.JWT_USER.secret,
                        (err, user: any) => {
                            doLate = async () => {
                                try {
                                    if (!err) {
                                        const find = await User.findAll({
                                            where: {
                                                username: user.username
                                            }
                                        });
                                        if (find.length > 0) {
                                            if (haveTo) if (!haveTo(find[0])) return;
                                            req.user = find[0];
                                            next();
                                            return;
                                        }
                                        return res.sendStatus(404);
                                    }
                                    return res.sendStatus(403);
                                } catch (err) {
                                    return res.sendStatus(500);
                                }
                            }
                        });
                    return await doLate();
                } else if (req.user) {
                    if (haveTo) if (!haveTo(req.user)) return res.sendStatus(401);
                    return next();
                } else {
                    return res.sendStatus(401);
                }
            }
        }
    }


    static async login(req: Requests.UserLogin, res: Response) {
        try {
            const userLoginDTO = await Validation.validate(new UserLoginValidation(), req.body)
            const userDTO = await UserService.login(userLoginDTO)
            return res.json(userDTO);
        } catch (error) {
            if (error instanceof ValidationErrorDTO) {
                return res.status(400).json(
                    new ErrorMessageDTO({
                        title: "Error at login.",
                        origin: "API User Logger",
                        description: "User data has some errors.",
                        status: 400,
                        errors: error
                    }));
            }
            if (error instanceof ErrorMessageDTO)
                return res.status(error.status).json(error);
            return res.sendStatus(500);
        }
    }

    static async create(req: Requests.UserCreate, res: Response) {
        try {
            const newUserDTO = await Validation.validate(new CreateUserValidation(), req.body);
            const userDTO = await UserService.createAndLogin(newUserDTO.props);
            return res.status(201).json(userDTO)
        } catch (err) {
            if (err instanceof ValidationErrorDTO) {
                return res.status(401).json(
                    new ErrorMessageDTO({
                        title: "Error at creating user.",
                        origin: "API User Creator",
                        description: "User data has some errors.",
                        status: 401,
                        errors: err
                    }));
            }
            if (err instanceof ErrorMessageDTO)
                return res.status(err.status).json(err);
            console.log(err);
            return res.sendStatus(500);
        }
    }

    static async getAll(req: Requests.GetAllUsers, res: Response) {
        try {
            const users = await UserService.getAll(req.query);
            return res.json(users);
        } catch (err) {
            if (err instanceof Specificator.Exception.NotMatchSpecificator) {
                return res.status(400).json(
                    new ErrorMessageDTO({
                        title: "Error at get all users.",
                        origin: "API User",
                        description: "filter",
                        status: 400,
                        errors: err
                    }));
            }
            if (err instanceof ErrorMessageDTO)
                return res.status(err.status).json(err);
            if (Config.Props.IsDev)
                console.log(err);
            return res.sendStatus(500);
        }
    }

    static get(req: Requests.ModelFinder, res: Response) {
        if (req.models && req.models.user instanceof User)
            if (!req.models.user.get("deleted"))
                return res.json(req.models.user.toDTO());
            else
                return res.status(400).json(
                    new ErrorMessageDTO({
                        title: "Find user.",
                        origin: "API User Finder",
                        description: "User was deleted.",
                        status: 400
                    }))
        return res.sendStatus(404);
    }

    static async update(req: Requests.UserUpdate, res: Response) {
        if (req.models && req.models.user instanceof User) {
            try {
                const data = await Validation.validate(new UpdateUserValidation(), req.body);
                if (req.user) {
                    const userDTO = await UserService.update(req.models.user, data, req.user);
                    if (userDTO) {
                        return res.status(201).json(userDTO);
                    }
                }
                return res.sendStatus(300);
            } catch (err) {
                if (err instanceof ValidationErrorDTO) {
                    return res.status(401).json(
                        new ErrorMessageDTO({
                            title: "Error at creating user.",
                            origin: "API User Update",
                            description: "User data has some errors.",
                            status: 401,
                            errors: err
                        }));
                }
                if (err instanceof ErrorMessageDTO)
                    return res.status(err.status).json(err);
                return res.sendStatus(500);
            }
        }
        return res.sendStatus(404);
    }

    static async destroy(req: Requests.UserAuth, res: Response) {
        if (req.models && req.models.user instanceof User && req.user && req.user.get('id') == req.models.user.get('id')) {
            return res.json(await UserService.destroy(req.models.user));
        }
        return res.sendStatus(404);
    }


}