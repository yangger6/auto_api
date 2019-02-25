import {Schema} from "mongoose";
const parameterSchema = new Schema({
    name: String,
    default: String,
    required: {
        type: Boolean,
        default: false
    },
    in: String,
    type: String,
    desc: String,
})
export {
    parameterSchema
}
