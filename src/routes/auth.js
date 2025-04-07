import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { toUserDTO } from "../util/dto.js";
import { getToken } from "../util/getToken.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();

const router = express.Router();

// Register   POST /api/auth/register
router.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || "livs-hakim"
    );

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Me
router.get("/me", async (req, res) => {
  try {
    const token = getToken(req);

    if (!token) {
      res.status(401);
      res.json({ error: `You do not have a token.` });
      return;
    }

    const userData = jwt.verify(token, process.env.JWT_SECRET || "livs-hakim");

    if (!userData || !userData?.email) {
      res.status(400);
      res.json({ error: "Your token is invalid. Maybe it expired?" });
      return;
    }

    const foundUser = await User.findOne({ email: userData.email });

    if (!foundUser) {
      res.status(404);
      res.json({
        error:
          "Your token was valid but did not match any users in the database. Maybe the user was deleted or has changed their email?",
      });
      return;
    }

    res.json(foundUser);
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});

//TODO Login
router.post("/users/login", async (req, res) => {
  try {
    const foundUser = await User.findOne({ email: req.body.email }).lean();
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      foundUser.password
    );
    if (!validPassword) {
      return res.status(401).json({ message: "Password is incorrect" });
    }
    const token = jwt.sign(foundUser, process.env.JWT_SECRET || "livs-hakim", {
      expiresIn: "2w",
    });
    res.cookie("hakim-livs-token", token);

    res.json({
      user: toUserDTO(foundUser),
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error?.message });
  }
});

export default router;
