import {Controller, Param, Body, Get, Post, Put, Delete, HttpCode} from "routing-controllers";
import {Sprider} from "../sprider";
import {config} from "../config";
import EjsRender from "../ejs/EjsRender";
import {ApiInfoModel} from "../models/ApiInfo";

@Controller()
export class UserController {
    @Get("/users")
    getAll() {
        return "This action returns all users";
    }
    @Get("/get-api")
    @HttpCode(200)
    async getApi() {
        const sprider = new Sprider(config.development.patchUrl)
        const body = await sprider.run()
        return JSON.stringify(body)
    }
    @Get("/write-api")
    @HttpCode(200)
    async writeApi() {
        const apiList = await ApiInfoModel.find()
        const ejsRender = new EjsRender('./src/ejs/tsInterface.ejs')
        await ejsRender.renderByAll(apiList)
    }
    @Get("/users/:id")
    async getOne(@Param("id") id: number) {
        return "This action returns user #" + id;
    }
}
