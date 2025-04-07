import mongoose from "mongoose"
import Product from './Product.js'

// Order schema
const orderSchema = new mongoose.Schema(
  {
    totalPrice: {
      type: Number,
      required: true,
      default: 0
    },
    VAT: {
      type: Number,
      required: true,
      default: 0
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
        quantity: { type: Number, required: true }
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
    const foundProduct = await Product.findById(product.productId)
    if (!foundProduct) throw new Error({
      message: `This product id did not match any document in the database: "${product.productId}"`
    })
    this.totalPrice += foundProduct.price * product.quantity;
  }

  // Calculating VAT (e.g., 12%)
  this.VAT = this.totalPrice * 0.12; // Example for 12% VAT
  next();
});

const Order = mongoose.model("Order", orderSchema);

export default Order