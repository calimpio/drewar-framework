import { NextFunction, Response} from "express";
import { Config, HashTypeEnum } from "../config";
import { Requests } from "../gate/requests";
import { Hash } from "./hash";


interface IModel {
    findByPk: (id: number, ops?: any) => Promise<any>
}

export class UtilMiddlewares {
    static getModelById<T extends IModel>(
        param: string,
        ModelDao: T,
        hashType: HashTypeEnum = HashTypeEnum.Models) {
        return async (req: Requests.ModelFinder, res: Response, next: NextFunction) => {
            try {
                if (req.params) {
                    const id = Hash.decodeByConfig(hashType, req.params[param])
                    if (!req.models) req.models = {}
                    req.models[param] = await ModelDao.findByPk(id as number, {
                        logging: Config.Props.IsDev
                    });
                    if (req.models[param]) {
                        next();
                        return;
                    }
                }
                return res.sendStatus(404);
            } catch (err) {
                return res.sendStatus(500);
            }
        }
    }
}