import { IDeviceDTO } from "../dto/deviceDTO";
import jwt from "jsonwebtoken"
import { Config } from "../config";
import Device from "../model/device";

export class DeviceService {

    static sign(device: IDeviceDTO, options?: jwt.SignOptions) {
        return jwt.sign({
            name: device.name,
            type: device.type
        },
            Config.Props.JWT_DEVICE.secret, options
        )
    }

    static async create(deviceDTO: IDeviceDTO) {
        return (await Device.create({
            name: deviceDTO.name,
            type: deviceDTO.type
        }, { logging: Config.Props.IsDev })).toDTO();
    }

    static async signWeb() {
        const web = await Device.findOne({ where: { name: "web" } })
        const webDTO = web ? web.toDTO() : null;
        return webDTO ? DeviceService.sign(webDTO) : null;
    }
}