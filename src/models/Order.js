import mongoose from "mongoose";
import Product from "./Product.js";
import { Schema } from "mongoose";
import {
  emailRegex,
  nameRegex,
  fullAddressRegex,
  phoneRegex
} from "../util/regexValidation.js";


// Order schema
const orderSchema = new mongoose.Schema(
  {
    // We use that field into pre hook so I left it as well here (not sure)
    orderID: {
      //It's required as String, let me know if I'm wrong with that type
      type: String,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    firstName: {
      type: String,
      required: true,
      maxlength: 100,
      match: [nameRegex, "Förnamn får bara innehålla bokstäver och bindestreck"]
    },
    lastName: {
      type: String,
      required: true,
      maxlength: 100,
      match: [nameRegex, "Efternamn får bara innehålla bokstäver och bindestreck"]
    },
    address: {
      type: String,
      required: true,
      maxlength: 100,
      match: [fullAddressRegex, "Ogiltig adressformat. Använd formatet: Gatuadress Postort 12345"]
    },
    email: {
      type: String,
      required: true,
      maxlength: 100,
      lowercase: true,
      match: [emailRegex, "Ogiltig e-postadress"]
    },
    // In case if user writes different kinds of format like +46... spaces, parentheses etc.
    phoneNumber: {
      type: String,
      required: true,
      maxlength: 100,
      match: [phoneRegex, "Telefonnummer får endast innehålla siffror och '+'"]
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    VAT: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending", // Initial order status
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

// Pre hook for generating orderID (8 digits)
orderSchema.pre("save", function (next) {
  if (!this.orderID) {
    this.orderID = Math.floor(10000000 + Math.random() * 90000000).toString(); // Generate a random 8-digit ID
  }
  next();
});

// Pre hook for calculating totalPrice and VAT
orderSchema.pre("save", async function (next) {
  // Calculating the total price (excluding VAT)
  for (const product of this.products) {
    const foundProduct = await Product.findById(product.productId);
    if (!foundProduct)
      throw new Error({
        message: `This product id did not match any document in the database: "${product.productId}"`,
      });
    this.totalPrice += foundProduct.price * product.quantity;
  }

  // Calculating VAT (e.g., 12%)
  this.VAT = this.totalPrice * 0.12; // Example for 12% VAT
  next();
});

// Pre hook for validating product quantities
orderSchema.pre("save", async function(next) {
    for (const product of this.products) {
      const foundProduct = await Product.findById(product.productId);
      console.log(product, foundProduct)
      if (product.quantity > foundProduct.stock) {
        let ending;
        if (foundProduct.stock > 1) {
          ending = `there are only ${foundProduct.stock} left.`
        } else if (foundProduct.stock === 1) {
          ending = `there is only ${foundProduct.stock} left.`
        } else {
          ending = `there are none left.`
        }
        throw new Error(`You cannot place this order because you are trying to order ${product.quantity} of "${foundProduct.name}" when ${ending}`)
      }
    }

    next()
})

// Post hook for adjusting the stock of the item
orderSchema.post("save", async function(doc, next) {
  for (const product of doc.products) {
    const foundProduct = await Product.findById(product.productId);
    foundProduct.stock -= product.quantity
    if (foundProduct.stock < 0) foundProduct.stock = 0
    await foundProduct.save()
  }
  next()
})

const Order = mongoose.model("Order", orderSchema);

export default Order;
