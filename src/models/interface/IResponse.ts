import {Document} from 'mongoose'

interface IParameter extends Document {
    // 返回代码
    httpCode: String
    // 子级参数
    items: string
    // 参数类型
    type: string
    // 返回结果
    description: string
    // 描述
    desc: string
}
export default IParameter
