import fs from "fs"
import evnDef from "../src/config/evn.def"
function randomStr(len: number) {
    let r = "";
    for (let i = 0; i < len; i++) {
        const n = Math.round((Math.random() * 60)) + 65
        const c = String.fromCharCode(n);
        r += c
    }
    return r.trim().split('\n').join("");
}

const env = Object.values(evnDef).map((data, i) => {
    return `${Object.keys(evnDef)[i]}=${data instanceof Object ? randomStr(data.randomStr) : data}`
}).join("\n");

fs.writeFileSync("./src/.env", env)
