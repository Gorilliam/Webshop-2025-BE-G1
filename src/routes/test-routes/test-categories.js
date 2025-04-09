import { Router } from "express";
import Category from "../../models/Category.js";

const testCategoriesRouter = Router()

testCategoriesRouter.post('/addCategory', async (req, res) => {
    try {
        const newCat = await Category.create({ name: req.body.name })
        res.json({ message: `Category added`, category: newCat })
    } catch (error) {
        res.status(400)
        res.json({
            message: `Failed adding product.`,
            error: error?.message,
            errorObj: error
        })
    }
})

testCategoriesRouter.post('/addCategories', async (req, res) => {
    // validate array
    const categories = req.body;
    if (!Array.isArray(categories)) {
        res.status(400)
        res.json({ error: `Request body must be an array/list.` })
        return
    }

    const addedCategories = []
    const failedCategories = []

    for (const cat of categories) {
        try {
            const newCat = await Category.create({ name: cat.name })
            addedCategories.push(newCat)
        } catch (error) {
            failedCategories.push({ category: cat, error: error?.message })
        }
    }

    if (failedCategories.length) {
        res.status(400)
        res.json({
            error: `${failedCategories.length} categories failed to be added.`,
            failedCategories,
            addedCategories
        })
        return
    }

    res.json({
        message: `Success!`,
        categories: addedCategories
    })

})

export default testCategoriesRouter