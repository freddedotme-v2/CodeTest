import express from 'express'
import { validationResult, param, header, matchedData } from 'express-validator'
import GraphQLManager from '../graphql/manager.ts'

const router = express.Router()
const manager = new GraphQLManager()

router.use(header('x-api-key').notEmpty().escape(), (req, res, next) => {
    const result = validationResult(req)

    if (result.isEmpty()) {
        const data = matchedData(req)
        manager.API_KEY = data['x-api-key']
        next()
    } else {
        res.status(400).json({ errors: result.array() })
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

router.get('/:id', param('id').escape(), async (req, res) => {
    const result = validationResult(req)

    if (result.isEmpty()){
        const data = matchedData(req)
        const ID = data['id']

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
    } else {
        res.status(400).json({ errors: result.array() })
    }
})

export default router