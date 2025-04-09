import dotenv from 'dotenv'; dotenv.config();
import User from '../models/User.js'
import Order from '../models/Order.js'
import jwt from 'jsonwebtoken'

export function getToken(req) {
    return (
        req.cookies?.['hakim-livs-token'] 
        || req.cookies?.token 
        || req.body?.['hakim-livs-token'] 
        || req.body?.token 
        || req.headers['x-token']
        || req.headers['hakim-livs-token']
        || req.headers['x-hakim-livs-token']
    );
}

export async function getUserDataFromToken(req) {
    const token = getToken(req)

    if (!token) {
        return { status: 400, error: "You must have a token." };
    };

    let userData;

    try {
        userData = jwt.verify(token, process.env.JWT_SECRET || 'livs-hakim')
    } catch (error) {
        console.log(error)
        return { status: 400, error: "Your token is invalid." }
    }

    if (!userData.email) {
        return { status: 400, error: "Your token is invalid." }
    }

    const foundUser = await User.findOne({ email: userData.email })

    if (!foundUser) {
        return { status: 404, error: "You token is valid but did not match an existing user. Maybe your email has changed?" }
    }

    // get previously used addresses and phone numbers
    const orders = await Order.find({ email: foundUser.email })
    const previouslyUsed = {
        addresses: [...new Set(orders.map(o => o.address))],
        phoneNumbers: [...new Set(orders.map(o => o.phoneNumber))]
    }

    return {...foundUser['_doc'], previouslyUsed}
}