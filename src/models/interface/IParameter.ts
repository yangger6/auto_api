import {Document} from 'mongoose'

interface IParameter extends Document {
    default: string
    // 参数名
    name: string
    // 参数是否必填
    required: boolean
    // 传参位置
    in: string
    // 参数类型
    type: string
    // 参数描述
    desc: string
    // 子级参数
    items?: IParameter[],
}
export default IParameter
