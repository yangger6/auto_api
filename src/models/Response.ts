import {Schema} from "mongoose";
import {parameterSchema} from "./Parameter";
const responseSchema = new Schema({
    description: String,
    httpCode: String,
    items: [parameterSchema],
    type: String,
    desc: String,
})
export {
    responseSchema
}
