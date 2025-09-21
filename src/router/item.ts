import express from 'express'
import GraphQLManager from '../graphql/manager.ts'

const router = express.Router()
const manager = new GraphQLManager()

router.use((req, res, next) => {
    if (req.get('x-api-key')){
        manager.API_KEY = req.get('x-api-key')!
        next()
    } else {
        res.status(400).send()
    }
})

router.get('/', async (req, res) => {
    const query = `
        query GetItems {
            getItems {
                id
                mandatoryString
                optionalBoolean
            }
        }
    `
    const response = await manager.query(query)

    if (response.success) {
        res.json(response.body)
    } else {
        res.status(400).send()
    }
})

router.get('/:id', async (req, res) => {
    const ID = req.params.id

    const query = `
        query GetItems($id: ID!) {
            getItem(id: $id) {
                id
                mandatoryString
                optionalBoolean
            }
        }
    `

    const response = await manager.query(query, { id: ID })

    if (response.success) {
        res.json(response.body)
    } else {
        res.status(400).send()
    }
})

export default router