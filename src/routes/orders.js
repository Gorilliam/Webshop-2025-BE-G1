import { Router } from "express";
import Order from "../models/Order.js";
import Order from "../models/Order";

const orderRoutes = Router()

orderRoutes.post("/", async (req, res) => {
    try {
        const newOrder = await Order.create(req.body)
        res.json(newOrder)
    } catch (error) {
        console.log(error)
        res.status(400)
        res.json({ error: error?.message })
    }
})

export default orderRoutes;