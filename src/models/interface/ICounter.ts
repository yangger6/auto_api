import {Document} from 'mongoose'
interface ICounter extends Document {
    // id
    _id: string
    // 计数器
    seq: number
}
export default ICounter
