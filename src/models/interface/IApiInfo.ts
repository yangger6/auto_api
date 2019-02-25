import {Document} from 'mongoose'
import IApi from "./IApi";
interface IApiInfo extends Document {
    infoId: number
    host: string
    baseUrl: string,
    name: string,
    // 版本
    version: string,
    // 标题
    title: string,
    apiList: IApi[]
}
export default IApiInfo
