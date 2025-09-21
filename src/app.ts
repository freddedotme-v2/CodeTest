import express from 'express'
import item from './router/item.ts'

const app = express()
const port = 3000;

if (!process.env.GQL_ENDPOINT) {
    console.log('-----------------------------------------------------')
    console.log('| Make sure to define required environment variables:')
    console.log('| *GQL_ENDPOINT -> GraphQL URL endpoint')
    console.log('-----------------------------------------------------')
} else {
    app.use('/item', item)
    app.listen(port, () => {
        console.log(`Listening on port ${port}`)
    })
}
