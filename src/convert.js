const JP = require('jsonpath');
import {
    isArray,
    isString,
    isPlainObject,
    isFunction,
    isObject
} from './utils/types'

function getUrl(xhr) {
    return xhr.responseURL;
}

function getMap(key) {
    return maps[key]
}

function isPrivateKey(key) {
    return key.indexOf('_') === 0 || key.indexOf('$') === 0
}

function warn(message, serious) {
    console.warn('DC:' + message)
}

function handleError(message) {
    throw new Error(message)
}



function Convert(source, map, config) {
    if (!isPlainObject(map)) {
        handleError('convert config not is a object')
    }
    this.data = source
    this.config = config = config || {}
    this.includeUnknownField = config.unknownField === 'include'
}

Convert.prototype.getKey = function (map, key) {
    const value = map[key]
    if (isString(value)) {
        return value
    }
    if (isPlainObject(value) && value._key) {
        return value._key
    }
    return key
}
Convert.prototype.getValue = function (key, source, formatter) {
    if (!key || !source) {
        return
    }
    let result = null
    const json = source
    const path = `$.${key}`
    result = JP.value(json, path)
    if (formatter) {
        result = formatter(result,source,this.data)
    }
    return result
}
Convert.prototype.deleteValue = function (key, data, mapKeys) {
    if (!key || !data) {
        return
    }
    const dataKeys = JP.parse('$.' + key);
    const deleteKey = dataKeys[1].expression.value
    if (!mapKeys.includes(deleteKey)) {
        delete data[deleteKey]
    }
}
Convert.prototype.filterUnknownField = function (value, sourceKeys) {
    if (isArray(value)) {
        value = value.map(item => {
            if (isPlainObject(item)) {
                return this.filterUnknownField(item, sourceKeys)
            }
            return item
        })
    } else if (isPlainObject(value)) {
        const result = {}
        sourceKeys.forEach(key => {
            result[key] = value[key]
        })
        return result
    }
    return value
}
Convert.prototype.filterKey = function(map){
    if(isArray(map._includeKeys) && isArray(map._excludeKeys)){
        warn('不能同时包含选项_includeKeys和_excludeKeys，将只应用_includeKeys');
    }
    if(isArray(map._includeKeys)){
        return function(data){
            const result = {}
            map._includeKeys.forEach(key=>{
                result[key] = data[key]
            })
            return result
        }
    }else if(isArray(map._excludeKeys)){
        return function(data){
            const result = data
            map._excludeKeys.forEach(key=>{
                delete result[key]
            })
            return result
        }
    }
    return undefined
}

Convert.prototype.getData = function (source, map) {
    if (!source) {
        return
    }
    if (isArray(source)) {
        return source.map(element => {
            return this.getData(element, map)
        });
    }
    const filterKeyFn = this.filterKey(map)
    let result = this.includeUnknownField || isFunction(map._formatter) || filterKeyFn ? JSON.parse(JSON.stringify(source)) : {};
    if(filterKeyFn){
        result = filterKeyFn(result)
    }
    const mapKeys = Object.keys(map)
    for (const key in map) {
        if (map.hasOwnProperty(key)) {
            if (isPrivateKey(key)) {
                continue;
            }
            const childMap = map[key];
            const isFormatter = isFunction(childMap._formatter)
            const dataKey = this.getKey(map, key) // 对方key
            let value = this.getValue(dataKey, source, isFormatter && childMap._formatter) // 我要的data
            if (key !== dataKey) {
                this.deleteValue(dataKey, result, mapKeys)
            }
            if (isPlainObject(childMap)) {
                result[key] = this.getData(value, childMap)
            } else {
                result[key] = value
            }
        }
    }
    return Object.keys(result).length ? result : undefined
}
