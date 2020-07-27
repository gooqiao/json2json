"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = __importDefault(require("./main"));
const maps_1 = __importDefault(require("./maps"));
const config_1 = __importDefault(require("./config"));
const model_1 = __importDefault(require("./model"));
function main() {
    const map = maps_1.default["/test/api/user"];
    const data = model_1.default;
    let convert = new main_1.default(data, map, config_1.default);
    const result = convert.getData(data, map);
    console.log(result);
}
main();
//# sourceMappingURL=index.js.map