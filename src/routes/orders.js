import { Router } from "express";
import Order from "../models/Order.js";
import User from "../models/User.js";

const orderRoutes = Router();

orderRoutes.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("products.productId"); // This will get all orders
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});

// Get revenue data for the past 12 months
orderRoutes.get("/yearly", async (req, res) => {
  try {
    // Get the current date
    const now = new Date();

    // Create an object to store revenue data for each month
    const result = {};

    // Loop through the last 12 months
    for (let i = 0; i < 12; i++) {
      const date = new Date(now);
      date.setMonth(now.getMonth() - i); // Shift back one month
      const monthName = date.toLocaleString("sv-SE", {
        month: "long",
        year: "numeric",
      }); // e.g. "mars 2025"
      result[monthName] = 0; // Initialize revenue for this month to 0
    }

    // Get revenue data from the database for the last 12 months
    const startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }, // Filter orders from the last year
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }, // Group by year and month
          },
          total: { $sum: "$totalPrice" }, // Sum up revenue per month
        },
      },
      {
        $sort: { "_id.year": -1, "_id.month": -1 }, // Sort from most recent
      },
    ]);

    // Fill in result with actual revenue from the database
    monthlyRevenue.forEach((entry) => {
      const monthName = new Date(
        entry._id.year,
        entry._id.month - 1
      ).toLocaleString("sv-SE", {
        month: "long",
        year: "numeric",
      });
      result[monthName] = entry.total; // Set actual revenue for the month
    });

    // Send the final result to the client
    res.json(result);
  } catch (error) {
    console.error("Error fetching revenue:", error);
    res.status(500).json({ error: "Server error" });
  }
});

orderRoutes.get("/:orderID", async (req, res) => {
  const { orderID } = req.params;

  try {
    const order = await Order.findOne({ orderID }).populate(
      "products.productId"
    );

    if (!order) {
      console.log(order);
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: error?.message });
  }
});

orderRoutes.post("/", async (req, res) => {
  try {
    if (!req.body?.products) {
      res.status(400);
      res.json({
        error:
          "Request body must be an object with the order data and a property called 'products'. See /api/ for more details.",
      });
      return;
    }

    if (req.body.products.length < 1) {
      res.status(400);
      res.json({ error: "The order must contain at least one product." });
      return;
    }

    if (req.body.user || req.user) {
      const id = req.body?.user || req.user?._id;
      const foundUser = await User.findById(id);
      if (!foundUser)
        return res.status(404).json({
          error: `Object id did not match any users in the database: "${id}"`,
        });
    }

    const newOrder = await Order.create(req.body);
    res.json(newOrder);
  } catch (error) {
    console.log(error);
    res.status(400);
    res.json({ error: error?.message });
  }
});

orderRoutes.put("/:orderID/:status", async (req, res) => {
  try {
    const { orderID, status } = req.params;

    // Validate the status
    const allowedStatuses = ["pending", "shipped", "delivered", "cancelled"];
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
