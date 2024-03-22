import { Request, Response, Router } from 'express';
import path from 'path';
import { Config } from '../config';
import { DeviceService } from '../service/deviceService';

// Export the base-router
const web = Router();
const staticDir = path.join(__dirname, '../public');

web.get('/**', async (req: Request, res: Response) => {
    try {
        const apitoken = await DeviceService.signWeb();
        if (apitoken) {
            const api = `${Config.Props.API.host}:${Config.Props.API.port}`
            const apihost = `${api}/api`
            const statics = `${api}/public`
            return res.render("index", { apitoken, apihost, statics, app_name: Config.Props.APP_NAME })
        }
        return res.status(404).send("not found");
    } catch (err) {
        return res.status(404).send("not found");
    }
})

export default web;
