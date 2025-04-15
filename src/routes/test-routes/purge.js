import { Router } from "express";
import Product from "../../models/Product.js";
import Category from "../../models/Category.js";
import User from "../../models/User.js";
import Order from "../../models/Order.js";

const purgeRouter = Router()

purgeRouter.delete('/purgeProducts', async (req, res) => {
    try {
        await Product.deleteMany({})
        await putBackTony()
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
        await putBackTony()
        res.json({ message: `All products, categories, users, and orders deleted.` })
    } catch (error) {
        res.status(500)
        res.json({
            error: error?.message
        })
    }
})

export default purgeRouter





























export async function putBackTony() {
    try {
        // see if tom kategori exists
        let dvdKategori = await Category.findOne({ name: "DVD"})

        // if not create
        if (!dvdKategori) {
            dvdKategori = await Category.create({ name: "DVD" })
        }

        // put back tony
        await Product.create({
            category: dvdKategori._id,
            name: "The Sopranos Complete Series 1",
            price: 350,
            image: "https://cdn.hmv.com/r/w-1280/p-webp/hmv/files/0f/0fa37188-ea9f-4291-90f7-a0c65591cb78.jpg",
            unit: "st",
            amount: 1,
            brand: "HBO",
            discount: 1,
            description: "Hela första säsongen av The Sopranos på DVD",
            stock: 1000
        })

    } catch (_) {
        // you didn't see nothin
    }
}