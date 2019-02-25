import {IApiInfo} from "../models/ApiInfo";
import {resolve} from "path";
import * as fs from "fs";
import * as ejs from 'ejs'
import {getUpCaseName} from "../utils/fileNameHelper";
export default class EjsRender {
    ejsPath: string
    constructor(path: string) {
        this.setEjsPath(path)
    }
    setEjsPath(path: string) {
        this.ejsPath = path
    }
    async renderByAll(apiList: IApiInfo[]) {
        try {
            await Promise.all(apiList.map(async(apiController: IApiInfo) => {
                await this.renderByController(apiController)
            }))
        } catch (e) {
            console.log(e)
        }
    }
    async renderByController(controller: IApiInfo) {
        const formTemp = fs.readFileSync(resolve(this.ejsPath), 'utf-8')
        // 解析 渲染
        let formRender = ejs.render(formTemp, this.computedController(controller))
        await this.writeFile(`./src/ejs/Interfaces/I${getUpCaseName(controller.name)}.ts`, formRender)
    }
    computedController(controller: IApiInfo) {
        controller.name = getUpCaseName(controller.name)
        return controller
    }
    async writeFile(path: string, content: string) {
        path = resolve(path)
        try {
            await fs.accessSync(path, fs.constants.F_OK)
            console.log('文件已存在', path)
        } catch (e) {
            try {
                await fs.writeFileSync(path, content)
                console.log('成功写入文件', path)
            } catch (e) {
                console.log(e)
                console.log('写入文件失败', path)
            }
        }
    }
}
