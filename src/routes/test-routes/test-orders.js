import { Router } from "express";
import Order from "../../models/Order.js";

const testOrdersRouter = Router()

testOrdersRouter.post("/addOrders", async (req, res) => {
    try {

        // validate orders is array
        if (!Array.isArray(req.body)) {
            res.status(400)
            res.json({ error: `request body must be an array` })
            return
        }

        const succeeded = []
        const failed = []

        for (const order of req.body) {
            try {
                const newOrder = await Order.create(order)
                succeeded.push(newOrder)
            } catch (error) {
                failed.push({
                    error: error?.message,
                    order
                })
            }
        }

        if (failed.length > 0) {
            res.status(400)
        }

        res.json({
            succededCount: succeeded.length,
            failedCount: failed.legth,
            succeeded,
            failed
        })

    } catch (error) {
        console.log(error)
        res.status(500)
        res.json({ error: error?.message, errorObj: error })
    }
})

export default testOrdersRouter