import {useKoaServer} from "routing-controllers"
import "reflect-metadata"
import {connect} from 'mongoose'
import * as Koa from 'koa'
import {config} from "./config";
const env = process.env.NODE_ENV || 'development'
async function start() {
    const app = new Koa()
    if (env === 'development') {
        try {
            await connect(config.development.db.link,{ useNewUrlParser: true })
        } catch (e) {
            console.log(`mongodb connect error -> ${e}`)
        }
        console.log(`mongodb connect successfully`)
    }
    useKoaServer(app, {
        controllers: [__dirname + "/controllers/**/*.js"],
        // middlewares: [__dirname + "/middlewares/**/*.js"],
        // interceptors: [__dirname + "/interceptors/**/*.js"],
        validation: true,
        defaultErrorHandler: true,
    }).listen(3000, () => {
        console.log(`server listen 3000 port`)
    })
}
start().then(() => {})
