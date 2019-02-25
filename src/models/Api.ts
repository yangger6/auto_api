import {model, Schema} from "mongoose";
import IApi from "./interface/IApi";
import {parameterSchema} from "./Parameter";
import {responseSchema} from "./Response";
const ApiSchema = new Schema({
    id: String,
    name: String,
    path: String,
    desc: String,
    consumes: String,
    method: String,
    parameters: [parameterSchema],
    responses: [responseSchema],
    autoUpdate: {
        type: Boolean,
        default: true
    }
})
const ApiModel = model<IApi>('api_item', ApiSchema)
export {
    IApi,
    ApiModel,
    ApiSchema
}
