import { Router } from "express";
import Product from "../../models/Product.js";
import Category from "../../models/Category.js";
import User from "../../models/User.js";
import Order from "../../models/Order.js";

const purgeRouter = Router()

purgeRouter.delete('/purgeProducts', async (req, res) => {
    try {
        await Product.deleteMany({})
        res.json({ message: `All products deleted.` })
    } catch (error) {
        res.status(500)
        res.json({
            error: error?.message
        })
    }
})

purgeRouter.delete('/purgeCategories', async (req, res) => {
    try {
        await Category.deleteMany({})
        res.json({ message: `All categories deleted.` })
    } catch (error) {
        res.status(500)
        res.json({
            error: error?.message
        })
    }
})

purgeRouter.delete('/purgeUsers', async (req, res) => {
    try {
        await User.deleteMany({})
        res.json({ message: `All users deleted.` })
    } catch (error) {
        res.status(500)
        res.json({
            error: error?.message
        })
    }
})

purgeRouter.delete('/purgeOrders', async (req, res) => {
    try {
        await Order.deleteMany({})
        res.json({ message: `All orders deleted.` })
    } catch (error) {
        res.status(500)
        res.json({
            error: error?.message
        })
    }
})


purgeRouter.delete('/purgeAll', async (req, res) => {
    try {
        await Product.deleteMany({})
        await Category.deleteMany({})
        await User.deleteMany({})
        await Order.deleteMany({})
        res.json({ message: `All products, categories, users, and orders deleted.` })
    } catch (error) {
        res.status(500)
        res.json({
            error: error?.message
        })
    }
})

export default purgeRouter