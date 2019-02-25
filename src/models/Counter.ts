import {model, Schema} from "mongoose";
const CounterSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    seq: {
        type: Number,
        default: 0
    },
})
const CounterModel = model('counter', CounterSchema)
export {
    CounterModel
}
