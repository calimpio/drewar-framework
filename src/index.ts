import { appAPI, appWEB } from './Server';
import { Config } from './config';
import { DeviceType } from './dto/deviceDTO';
import { DeviceService } from './service/deviceService';


const portAPI = Config.Props.API.port;
const portWEB = Config.Props.WEB.port;

appAPI.listen(portAPI, () => {
    if (Config.Props.IsDev) {
        console.log(Config.Props.APP_NAME + "-API");
        console.log("Headers:");
        console.log(Config.Props.API_HEADER + ":" + DeviceService.sign({ name: "api", type: DeviceType.APP }));
    }
});

appWEB.listen(portWEB, () => {
    if (Config.Props.IsDev)
        console.log("web");
})
