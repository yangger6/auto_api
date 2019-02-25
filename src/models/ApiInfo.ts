import {Model, model, Schema, Types} from "mongoose";
import {CounterModel} from "./Counter";
import IApiInfo from "./interface/IApiInfo";
import IApi from "./interface/IApi";
import {ApiModel, ApiSchema} from "./Api";
import {ok} from "assert";
const ApiInfoSchema = new Schema({
    infoId: {
        type: Number,
        default: 0
    },
    host: String,
    baseUrl: {
        type: String,
        default: '/'
    },
    name: String,
    version: String,
    title: String,
    apiList: [ApiSchema]
})
ApiInfoSchema.pre('save', async function (next) {
    try {
        const doc: any = this
        const result: any = await CounterModel.findByIdAndUpdate({_id: 'infoId'}, {$inc: {seq: 1}}, {new: true, upsert: true})
        doc.apiId = result.seq
        await next()
    } catch (e) {
        console.error('counter error-> : ' + e)
        throw e
    }
})
ApiInfoSchema.statics.saveTagList = async function ({host, baseUrl, version}: IApiInfo, list: IApiInfo[]) {
    try {
        await Promise.all(list.map(async (info: any) => {
            await ApiInfoModel.findOneAndUpdate({
                name: info.name,
            }, {
                $set: {
                    host,
                    baseUrl,
                    title: info.description,
                    version
                }
            },{
                new: true,
                upsert: true
            })
        }))
    } catch (e) {
        console.log(e)
    }
}
ApiInfoSchema.statics.saveApiList = async function (apiControllerList: any) {
    await Promise.all(Object.keys(apiControllerList).map(async (controllerName: string) => {
        const apiData: IApi[] = apiControllerList[controllerName]
        let nameList: string[] = []
        const apiModels: IApi[] = apiData.map((api: IApi) => {
            nameList.push(api.name)
            return new ApiModel(api)
        })
        const result: any = await ApiInfoModel.findOne({
            name: controllerName,
        })
        const oldApiList = result.apiList
        const currentApiList = apiModels.map((api: IApi) => {
            let oldApiData: any = oldApiList.find(({name}: IApi) => name === api.name)
            if (oldApiData && !oldApiData.autoUpdate) {
                return oldApiData
            }
            return api
        })
        await ApiInfoModel.updateOne({
            name: controllerName
        }, {
            $set: {
                apiList: currentApiList
            }
        })
        return currentApiList
    }))
    return {
        message: 'ok'
    }
}
interface IApiInfoExtend extends Model<IApiInfo> {
    saveTagList(baseInfo:object, list: IApiInfo[]): Promise<{ok: number}>
    saveApiList(apiList: IApi[]): Promise<{ok: number}>
}
const ApiInfoModel = model<IApiInfo>('api', ApiInfoSchema) as IApiInfoExtend
export {
    IApiInfo,
    ApiInfoModel,
    IApiInfoExtend
}
