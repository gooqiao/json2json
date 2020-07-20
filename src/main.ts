import JP from "jsonpath";
import {
  isArray,
  isString,
  isPlainObject,
  isFunction,
  isObject,
} from "./utils/types";

function isPrivateKey(key: string) {
  return key[0] === "_" || key[0] === "$";
}

function warn(message: string, serious?: boolean) {
  console.warn("DC:" + message);
}

function handleError(message: string) {
  throw new Error(message);
}

interface Cv {
  data: unknown;
  config: ConfigOptions;
  includeUnknownField: boolean;
}

interface ConverConstructor {
  new (source: unknown, map: ApiMap, config?: ConfigOptions): Cv;
}

class Convert {
    includeUnknownField:boolean
    constructor(public source:unknown, public map: ApiMap,public config?: ConfigOptions){

  if (!isPlainObject(map)) {
    handleError("convert config not is a object");
  }
    }
  this.includeUnknownField = config.unknownField === "include";

  this.data = source;
  this.config = config;
}

Convert.prototype.getKey = function (map: ApiMap, key: string) {
  const value = map[key];
  if (isString(value)) {
    return value;
  }
  if (isPlainObject(value) && (<MapOptions>value)._key) {
    return (value as MapOptions)._key;
  }
  return key;
};
Convert.prototype.getValue = function (
  key: string,
  source: ApiMap,
  formatter: MapOptions["_formatter"]
) {
  if (!key || !source) {
    return;
  }
  let result = null;
  const json = source;
  const path = `$.${key}`;
  result = JP.value(json, path);
  if (formatter) {
    //   , this.data
    result = formatter(result, source);
  }
  return result;
};
Convert.prototype.deleteValue = function (
  key: string,
  data: ApiMap,
  mapKeys: string[]
) {
  if (!key || !data) {
    return;
  }
  const dataKeys = JP.parse("$." + key);
  const deleteKey = dataKeys[1].expression.value;
  mapKeys.concat;
  if (!mapKeys.includes(deleteKey)) {
    delete data[deleteKey];
  }
};
Convert.prototype.filterUnknownField = function (
  value: unknown,
  sourceKeys: string[]
) {
  if (isArray(value)) {
    value = (value as unknown[]).map((item) => {
      if (isPlainObject(item)) {
        return this.filterUnknownField(item, sourceKeys);
      }
      return item;
    });
  } else if (isPlainObject(value)) {
    const result = {};
    sourceKeys.forEach((key) => {
      result[key] = value[key];
    });
    return result;
  }
  return value;
};
Convert.prototype.filterKey = function (map: MapOptions) {
  if (isArray(map._includeKeys) && isArray(map._excludeKeys)) {
    warn("不能同时包含选项_includeKeys和_excludeKeys，将只应用_includeKeys");
  }
  if (isArray(map._includeKeys)) {
    return function (data: ApiMap) {
      const result = {};
      map._includeKeys.forEach((key) => {
        result[key] = data[key];
      });
      return result;
    };
  } else if (isArray(map._excludeKeys)) {
    return function (data: ApiMap) {
      const result = data;
      map._excludeKeys.forEach((key) => {
        delete result[key];
      });
      return result;
    };
  }
  return undefined;
};

Convert.prototype.getData = function (source: unknown, map: ApiMap) {
  if (!source) {
    return;
  }
  if (isArray(source)) {
    return (source as Array<unknown>).map((element) => {
      return this.getData(element, map);
    });
  }
  const filterKeyFn = this.filterKey(map);
  let result =
    this.includeUnknownField || isFunction(map._formatter) || filterKeyFn
      ? JSON.parse(JSON.stringify(source))
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
      const childMap = map[key] as MapOptions;
      const isFormatter = isFunction(childMap._formatter);
      const dataKey = this.getKey(map, key); // 对方key
      let value = this.getValue(
        dataKey,
        source,
        isFormatter && childMap._formatter
      ); // 我要的data
      if (key !== dataKey) {
        this.deleteValue(dataKey, result, mapKeys);
      }
      if (isPlainObject(childMap)) {
        result[key] = this.getData(value, childMap);
      } else {
        result[key] = value;
      }
    }
  }
  return Object.keys(result).length ? result : undefined;
};

export default Convert;
