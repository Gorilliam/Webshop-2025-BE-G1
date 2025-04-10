import { Router } from "express";
import Order from "../models/Order.js";

const orderRoutes = Router();

orderRoutes.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("products.productId"); // This will get all orders
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});

orderRoutes.get("/:orderID", async (req, res) => {
    const { orderID } = req.params
    
    try {
        const order = await Order.findOne({orderID}).populate("products.productId")

      if (!order) {
        console.log(order)
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order)

    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ error: error?.message })
    }
})

orderRoutes.post("/", async (req, res) => {
  try {
    const newOrder = await Order.create(req.body);
    res.json(newOrder);
  } catch (error) {
    console.log(error);
    res.status(400);
    res.json({ error: error?.message });
  }
});

// you can just write the appropriate status for order and it changes directly without writing req.body into postman
orderRoutes.put("/:orderID/:status", async (req, res) => {
  try {
    const { orderID, status } = req.params;

    // Validate the status
    const allowedStatuses = [
      "pending",
      "sent",
      "delivered",
      "completed",
      "cancelled",
    ];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updateStatusOrder = await Order.findOneAndUpdate(
      { orderID }, // Find the order by orderID
      { status },
      { new: true }
    );

    // If the order is not found, return a 404 error
    if (!updateStatusOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(updateStatusOrder);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

export default orderRoutes;
