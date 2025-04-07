import { Router } from "express";
import Order from "../models/Order.js";
import Order from "../models/Order";

const orderRoutes = Router()

orderRoutes.get("/", async (req, res) => {
    try {
        const orders = await Order.find().populate("products.productId")  // This will get all orders
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error?.message });
    }
})

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