import Product from "../models/Product.js";
import Category from "../models/Category.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import { Router } from "express";

import testProductsRouter from "./test-routes/test-products.js";
import testCategoriesRouter from "./test-routes/test-categories.js";
import purgeRouter from "./test-routes/purge.js";
import testUsersRouter from "./test-routes/test-users.js";
import testOrdersRouter from "./test-routes/test-orders.js";

import fs from 'fs'

const testRouter = Router()

testRouter.use(testProductsRouter)
testRouter.use(testCategoriesRouter)
testRouter.use(purgeRouter)
testRouter.use(testUsersRouter)
testRouter.use(testOrdersRouter)


testRouter.post('/insertDocs', async (req, res) => {

    let createdCount = 0
    let failedCount = 0
    const created = {}
    const failed = {}

    try {
        if (req.body.purgeAllFirst) {
            await User.deleteMany({})
            await Product.deleteMany({})
            await Category.deleteMany({})
            await Order.deleteMany({})
        }

        const insertDocs = async (key) => {
            const model = ({users: User, products: Product, categories: Category, orders: Order})[key];

            if (!model) {
                res.status(400)
                res.json({ error: `${key} is not a valid model.` })
                return
            }

            created[key] = [];
            failed[key] = []

            for (const doc of req.body[key]) {
                try {                    
                    const newDoc = await model.create(doc)
                    created[key].push(newDoc)
                    createdCount++
                } catch (error) {
                    failed[key].push({
                        error: error?.message,
                        doc
                    })
                    failedCount++
                }
            }
        }

        await insertDocs('categories')
        await insertDocs('products')
        await insertDocs('users')
        await insertDocs('orders')
  
        res.json({
            message: `${createdCount} succeeded and ${failedCount} failed.`,
            created,
            failed
        })
    } catch (error) {
        res.status(500)
        res.json({ error: error?.message })
    }
})

function tryReadingData(name) {
    const paths = [
        `./src/data/${name}.json`,
        `./data/${name}.json`,
        `./dist/data/${name}.json`,
    ]

    for (const path of paths) {
        try {
            const data = JSON.parse(fs.readFileSync(path), null, 2)
            return data
        } catch (_) {}
    }

    return []
}

const testData = {
    purgeAllFirst: true,
    categories: tryReadingData('categories'),
    products: tryReadingData('products'),
    users: tryReadingData('users'),
    orders: tryReadingData('orders')
}

testRouter.get('/testData', (req, res) => {
    res.json(testData)
})


export default testRouter