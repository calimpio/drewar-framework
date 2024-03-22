import HashId from 'hashids'
import { Config, HashTypeEnum } from '../config'
const modules = Config.Props.HashProfiles[Config.Enum.HashTypeEnum.Models]
const password = Config.Props.HashProfiles[Config.Enum.HashTypeEnum.Password]

export class Hash {
    static encodeId(id: number | bigint) {
        const hashId = new HashId(modules.salt, modules.length)
        return hashId.encode(id);
    }

    static decodeId(id: string) {
        const hashids = new HashId(modules.salt, modules.length);
        const list = hashids.decode(id);
        return list.length > 0 ? list[0] : 0;
    }

    static encodePassword(psd: string) {
        const hashids = new HashId(password.salt, password.length);
        return hashids.encodeHex(psd);
    }

    static encodeByConfig(config: HashTypeEnum | undefined, value: any) {
        if (config == HashTypeEnum.Models) {
            return Hash.encodeId(value);
        }
        if (config == HashTypeEnum.Password) {
            return Hash.encodePassword(value);
        }
    }

    static decodeByConfig(config: HashTypeEnum | undefined, value: any) {
        if (config == Config.Enum.HashTypeEnum.Models) {
            return Hash.decodeId(value);
        }
    }
}