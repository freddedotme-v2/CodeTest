import express from 'express'
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import item from './router/item.ts'

const app = express()
const port = 3000;

if (!process.env.GQL_ENDPOINT) {
    console.log('-----------------------------------------------------')
    console.log('| Make sure to define required environment variables:')
    console.log('| *GQL_ENDPOINT -> GraphQL URL endpoint')
    console.log('-----------------------------------------------------')
} else {
    app.use(rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100
    }))

    app.use(slowDown({
        windowMs: 15 * 60 * 1000,
        delayAfter: 25,
        delayMs: () => 1000
    }))

    app.use('/item', item)
    app.listen(port, () => {
        console.log(`Listening on port ${port}`)
    })
}
