"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="./types/type.ts" />
const jsonpath_1 = __importDefault(require("jsonpath"));
const types_1 = require("./utils/types");
const lodash_1 = require("lodash");
function isPrivateKey(key) {
    return key[0] === "_" || key[0] === "$";
}
function warn(message, serious) {
    console.warn("DC:" + message);
}
function handleError(message) {
    throw new Error(message);
}
class Convert {
    constructor(data, map, config) {
        this.data = data;
        this.map = map;
        this.config = config;
        this.deleteValue = function (key, data, mapKeys) {
            if (!key || !data) {
                return;
            }
            const dataKeys = jsonpath_1.default.parse("$." + key);
            const deleteKey = dataKeys[1].expression.value;
            mapKeys.concat;
            if (!mapKeys.includes(deleteKey)) {
                delete data[deleteKey];
            }
        };
        this.filterUnknownField = function (value, sourceKeys) {
            if (types_1.isArray(value)) {
                value = value.map((item) => {
                    if (types_1.isPlainObject(item)) {
                        return this.filterUnknownField(item, sourceKeys);
                    }
                    return item;
                });
            }
            else if (types_1.isPlainObject(value)) {
                const result = {};
                sourceKeys.forEach((key) => {
                    result[key] = value[key];
                });
                return result;
            }
            return value;
        };
        this.filterKey = function (map) {
            if (types_1.isArray(map._includeKeys) && types_1.isArray(map._excludeKeys)) {
                warn("不能同时包含选项_includeKeys和_excludeKeys，将只应用_includeKeys");
            }
            if (types_1.isArray(map._includeKeys)) {
                return function (data) {
                    const result = {};
                    map._includeKeys.forEach((key) => {
                        result[key] = data[key];
                    });
                    return result;
                };
            }
            else if (types_1.isArray(map._excludeKeys)) {
                return function (data) {
                    const result = data;
                    map._excludeKeys.forEach((key) => {
                        delete result[key];
                    });
                    return result;
                };
            }
            return undefined;
        };
        if (!types_1.isPlainObject(map)) {
            handleError("convert config not is a object");
        }
        this.includeUnknownField = config.unknownField === "include";
        this.config = config;
    }
    getKey(map, key) {
        const value = map[key];
        if (types_1.isString(value)) {
            return value;
        }
        if (types_1.isPlainObject(value) && value._key) {
            return value._key;
        }
        return key;
    }
    getValue(key, model, formatter) {
        if (!key || !model) {
            return;
        }
        let result = null;
        const json = model;
        const path = `$.${key}`;
        result = jsonpath_1.default.value(json, path);
        if (formatter) {
            //   , this.data
            result = formatter(result, model);
        }
        return result;
    }
    getData(source, map) {
        if (!source) {
            return undefined;
        }
        if (types_1.isArray(source)) {
            return source.map((element) => {
                return this.getData(element, map);
            });
        }
        const filterKeyFn = this.filterKey(map);
        let result = this.includeUnknownField || types_1.isFunction(map._formatter) || filterKeyFn
            ? lodash_1.cloneDeep(source)
            : {};
        if (filterKeyFn) {
            result = filterKeyFn(result);
        }
        const mapKeys = Object.keys(map);
        for (const key in map) {
            if (map.hasOwnProperty(key)) {
                if (isPrivateKey(key)) {
                    continue;
                }
                const childMap = map[key];
                const isFormatter = types_1.isFunction(childMap._formatter);
                const dataKey = this.getKey(map, key); // 对方key
                let value = this.getValue(dataKey, source, isFormatter && childMap._formatter); // 我要的data
                if (key !== dataKey) {
                    this.deleteValue(dataKey, result, mapKeys);
                }
                if (types_1.isPlainObject(childMap)) {
                    result[key] = this.getData(value, childMap);
                }
                else {
                    result[key] = value;
                }
            }
        }
        return Object.keys(result).length ? result : undefined;
    }
}
exports.default = Convert;
//# sourceMappingURL=main.js.map