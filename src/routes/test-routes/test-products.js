import { Router } from "express";
import Product from "../../models/Product.js";
import Category from "../../models/Category.js";

const testProductsRouter = Router()

testProductsRouter.post('/addProduct', async (req, res) => {

    try {
        const id = await validateCategory(req.body.category);
        if (!id) {
            res.status(404)
            res.json({
                error: `No category found by value: ${req.body.category}. Ensure the request body's "category" field is either the category name or the category id.`
            })
            return;
        }

        req.body.category = id;
        const newProd = await Product.create(req.body)
        res.json({ message: `Product added successfully.`, product: newProd })
    } catch (error) {
        res.status(400)
        res.json({
            message: `Failed adding product.`,
            error: error?.message,
            errorObj: error
        })
    }

})

testProductsRouter.post('/addProducts', async (req, res) => {

    const products = req.body;

    // Validate body is array
    if (!Array.isArray(products)) {
        res.status(400)
        res.json({ error: "Request body must be an array/list. "})
        return
    }

    try {
        let addedProducts = []
        let failedProducts = []

        for (const product of products) {
            // validate category
            const id = await validateCategory(product.category);
            if (!id) {
                failedProducts.push({
                    product,
                    error: `No category found by value: ${product.category}. Ensure the product's "category" field is either the category name or the category id.`
                })
                continue;
            }
            product.category = id;

            try {
                const newProduct = await Product.create(product)
                addedProducts.push(newProduct)
            } catch (error) {
                failedProducts.push({ product, error: error?.message })
            }
        } // end loop

        if (failedProducts.length) {
            res.status(400)
            res.json({
                failedProducts,
                addedProducts,
                error: `${failedProducts.length} products could not be added.`
            })
            return
        }

        res.json({
            message: `Success!`,
            addedProducts
        })

    } catch (error) {
        res.status(500)
        res.json({
            message: `Something went wrong.`,
            error: error?.message,
            errorObj: error
        })
    }

})

// helpers
const validateCategory = async (nameOrId) => {
    try {

        const foundByName = await Category.findOne({ name: nameOrId })
        if (foundByName) return foundByName._id;

        const foundById = await Category.findById(nameOrId)
        if (foundById) return foundById._id;

    } catch (_) {
        return undefined
    }
}

export default testProductsRouter