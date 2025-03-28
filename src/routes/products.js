import express from "express";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { adminAuth } from "../middleware/auth.js";


const productRoutes = express.Router();

// Get all products
productRoutes.get("/", async (req, res) => {
  try {
    // Fetch products directly from the MongoDB database
    const products = await Product.find().populate({
      path: 'category',
      strictPopulate: false
    });  // This will get all products
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error?.message, errorObj: error });
}
});

//TODO Get single product

// Create product (admin only)
productRoutes.post("/", adminAuth, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//TODO Update product (admin only)

//TODO Delete product (admin only) Using request body
productRoutes.delete("/", adminAuth, async (req, res) => {
  try {
    let deletedProduct;

    if (req.body.name) {
      deletedProduct = await Product.findOneAndDelete({ name: req.body.name })
    } else if (req.body.id || req.body._id) {
      deletedProduct = await Product.findByIdAndDelete(req.body.id || req.body._id)
    } else {
      res.status(400)
      return res.json({ error: `You must provide a name or id field.`})
    }

    if (!deletedProduct) {
      res.status(404)
      return res.json({ error: `Product was not deleted as it was not found: "${req.body.id || req.body._id || req.body.name}"` })
    }

    res.json({ message: "Product deleted!", product: deletedProduct })
  } catch (error) {
    res.status(500)
    let errorMessage = error?.message || "";
    if (errorMessage.includes("Cast to ObjectId")) {
      errorMessage = `Invalid ObjectId.`
    }
    res.json({ error: errorMessage })
  }
})

//TODO Delete product (admin only) Using URL param
productRoutes.delete("/:id", adminAuth, async (req, res) => {
  try {
    let deletedProduct = await Product.findById(req.params.id);

    if (!deletedProduct) {
      res.status(404)
      return res.json({ error: `Product was not deleted as it was not found: "${req.body.id || req.body._id || req.body.name}"` })
    }

    res.json({ message: "Product deleted!", product: deletedProduct })
  } catch (error) {
    res.status(500)
    let errorMessage = error?.message || "";
    if (errorMessage.includes("Cast to ObjectId")) {
      errorMessage = `Invalid ObjectId.`
    }
    res.json({ error: errorMessage })
  }
})


// Get products by category
productRoutes.get("/by-category/:category", async (req, res) => {

  try {
    const category = await Category.findOne({ name: req.params.category }).populate({
      path: 'category',
      options: {
        strictPopulate: false
      }
    })
  
    if (!category) {
      res.status(404)
      res.json({
        error: `No category by the name of "${req.params.category}" was found. See /api/categories for a list of categories.`
      })
      return
    }
  
    // fetch products
    const products = await Product.find({ category: category._id });
  
    // error if no products found
    if (products.length <= 0) {
      res.status(404)
      res.json({
        products,
        error: `No products found.`
      })
      return
    }
  
    // success
    res.json({ products })
    
  } catch (error) {
    res.status(500)
    res.json({ error: error?.message })
  }

  
})

export default productRoutes;
