const mongoose = require("mongoose");

// Order schema
const orderSchema = new mongoose.Schema(
  {
    totalPrice: {
      type: Number,
      required: true,
    },
    VAT: {
      type: Number,
      required: true,
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
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }, // Product price
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
orderSchema.pre("save", function (next) {
  if (this.items && this.items.length > 0) {
    // Calculating the total price (excluding VAT)
    this.totalPrice = this.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Calculating VAT (e.g., 12%)
    this.VAT = this.totalPrice * 0.12; // Example for 12% VAT
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
