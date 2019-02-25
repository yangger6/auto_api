import * as request from "request";
import {ApiInfoModel} from "../models/ApiInfo";
import {get} from 'lodash'
import IParameter from "../models/interface/IParameter";
import {getUpCaseName} from "../utils/fileNameHelper";
import {quchong} from "../utils/arrayHelper";

export class Sprider {
    public url: string
    constructor(url: string) {
        this.url = url
    }
    setUrl(url: string) {
        this.url = url
    }
    async run () {
        try {
            const {host, basePath, info: {
                version
            }, definitions, paths, tags} = JSON.parse(await this.getPage())
            await ApiInfoModel.saveTagList({
                host,
                baseUrl: basePath,
                version
            }, tags)
            // 遍历接口
            const currentApiList: any = this.computeApi(paths, definitions)
            const res = await ApiInfoModel.saveApiList(currentApiList)
            return res
        } catch (e) {
            console.log(e)
        }
    }
    getPage (): any {
        return new Promise((resolve, reject) => {
            request.get(this.url, (err, res, body) => {
                if(err)
                    reject(err)
                else {
                    if(res.statusCode == 200){
                        resolve(body)
                    }else {
                        reject(new Error(`url -> ${this.url}  statusCode = ${res.statusCode}`))
                    }
                }
            })
        })
    }
    computeApi(paths: any, definitions: object) {
        let currentApiList: any = []
        Object.keys(paths).map((path: string) => {
            const apiController: any = paths[path];
            // 遍历同一个接口的不同请求格式
            Object.keys(apiController).map((method: string) => {
                // 真正的api
                const api = apiController[method]
                // 名字
                api.name = getUpCaseName(path.split(/\//).slice(-1)[0])
                // 地址
                api.path = path
                // 解析请求方式
                api.method = method
                // 解析请求方式
                api.consumes = api.consumes ? api.consumes[0] : ''
                // 解析接口作用
                api.desc = api.summary
                // 去重参数 解析请求参数
                api.parameters = quchong(api.parameters, 'name')
                api.parameters = api.parameters.map((parameter: IParameter) => {
                    if (parameter.name.match(/data\[0]/gi)) {
                        return undefined
                    }
                    if (parameter.schema) {
                        parameter = this.computeSchema(parameter, definitions)
                        delete parameter.schema
                    }
                    return parameter
                }).filter((parameters: any) => parameters)
                // 解析接口返回数据
                let currentResponses: any = []
                Object.keys(api.responses).map((httpCode: string) => {
                    let response = api.responses[httpCode]
                    response.httpCode = httpCode
                    if (response.schema) {
                        response = this.computeSchema(response, definitions)
                        delete response.schema
                    }
                    currentResponses.push(response)
                })
                api.responses = currentResponses
                api.tags.map((controllerName: string) => {
                    currentApiList[controllerName] ?
                        currentApiList[controllerName].push(api) :
                        currentApiList[controllerName] = [api]
                })
            })
        })
        return currentApiList
    }
    computeSchema(parameter: any, obj: object) {
        const schema: string = parameter.schema['$ref']
        if (schema) {
            const modelPath = schema.replace(/(#\/definitions\/|\/)/gi, (substring: string) => {
                if (substring === '/') {
                    return '.'
                }
                return ''
            })
            const modelVo = get(obj, modelPath)
            parameter.desc = modelVo.title
            parameter.type = modelVo.type
            parameter.items = modelVo.properties
        }
        return parameter
    }
}
