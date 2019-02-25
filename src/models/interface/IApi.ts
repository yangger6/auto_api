import {Document} from 'mongoose'
import IParameter from "./IParameter";

interface IApi extends Document {
    apiId: string
    // 接口名
    name: string
    // 请求地址
    path: string
    // 接口描述
    desc: string
    // 接口请求方式
    consumes: string,
    // 接口请求方式
    method: string,
    // 接口参数
    parameters: IParameter[]
    // 返回参数
    responses: IParameter[],
    // 自动更新
    autoUpdate: boolean
}
export default IApi
