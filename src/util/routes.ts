import { NextFunction, Response, IRouter, Router } from "express";


export namespace Routes {    

    interface IHandler<Req, Res extends Response = Response> {
        (req: Req, res: Res, next: NextFunction): void
    }

    interface IDRouter<Req, Res extends Response = Response> {
        get(path: string, ...handlers: Array<IHandler<Req, Res>>): void
        post(path: string, ...handlers: Array<IHandler<Req, Res>>): void
        put(path: string, ...handlers: Array<IHandler<Req, Res>>): void
        delete(path: string, ...handlers: Array<IHandler<Req, Res>>): void
        use(...handlers: Array<IHandler<Req, Res>>): void
    }

    export function createApp(parent: any, group: (portal: IRouter) => void) {
        const portal = Router();
        (parent as IRouter).use(portal);
        group(portal);
    }


    export function createGroup<Req, Res extends Response = Response>(parent: any, middlewares: Array<IHandler<Req, Res>>, group: (portal: IDRouter<Req, Res>) => void) {
        createApp(parent, (portal) => {
            (portal as IDRouter<Req, Res>).use(...middlewares);
            group(portal as IDRouter<Req, Res>);
        })
    }

    export function createPath<Req, Res extends Response = Response>(parent: any, path: string, group: (portal: IDRouter<Req, Res>) => void) {
        const portal = Router();
        (parent as IRouter).use(path, portal);
        group(portal as IDRouter<Req, Res>);
    }    
}