import fs from 'fs'
import Category from '../models/Category.js'
import Product from '../models/Product.js'
import User from '../models/User.js'
import Order from '../models/Order.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'; dotenv.config();

const categories = JSON.parse(fs.readFileSync('./src/data/categories.json'))
const products = JSON.parse(fs.readFileSync('./src/data/products.json'))
const users = JSON.parse(fs.readFileSync('./src/data/users.json'))
const orders = JSON.parse(fs.readFileSync('./src/data/orders.json'))

seed()

async function seed() {
    if (!process.env.MONGODB_URI?.includes('localhost')) {
        console.log("Warning: The MONGODB_URI you are using does not include 'localhost'. Process aborted to prevent the production data from being overwritten.")
        process.exit()
    }

    try {
        console.log(`Trying to connect to the database.`)
        await mongoose.connect(process.env.MONGODB_URI)
        console.log(`Successfully connected.`)
    } catch (error) {
        console.log(error)
        console.log(`Failed connecting to database.`, error?.message)
        process.exit()
    }
    await Product.deleteMany({})
    await Category.deleteMany({})
    await User.deleteMany({})
    await Order.deleteMany({})
    await seedOneModel("category", Category, categories)
    await seedOneModel("product", Product, products)
    await seedOneModel("user", User, users)
    await seedOneModel("order", Order, orders)
    console.log("DONE")
    process.exit()
}

async function seedOneModel(modelName, model, array) {
    console.log(`Starting to seed "${modelName}".`)
    const amt = array.length;
    for (let i = 0; i < amt; i++) {
        const item = array[i]
        console.log(`Seeding ${i+1} of ${amt}.`)
        try {
            if (modelName === "product") {
                item.unit = item.unit.toLowerCase()
            }
            await model.create(item)
            console.log(`Succeeded seeding ${modelName} "${item.name || item.username}".`)
        } catch (error) {
            console.log(error)
            console.log(`Failed seeding ${modelName} "${item.name || item.username}". ${error?.message}.`)
        }
    }
}