export const config: any = {
    development: {
        db: {
            link: 'mongodb://localhost:27017/auto_api'
        },
        patchUrl: 'http://host:port/v1/api-docs'
    },
    product: {
    },
    test: {
    }
}
