import dotenv from 'dotenv'; dotenv.config();
import { Router } from "express";
import User from "../../models/User.js";
import { toUserDTO } from "../../util/dto.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const testUsersRouter = Router()

testUsersRouter.get('/users', async (req, res) => {
    try {    
        console.log('finding users')
        const users = await User.find({}).populate('orders')
        res.json(users)
    } catch (error) {
        console.log(error)
        res.status(500)
        res.json({ error: error?.message })
    }
})

testUsersRouter.post('/users', async (req, res) => {
    try {
        const newUser = await User.create(req.body)
        const token = jwt.sign(toUserDTO(newUser), process.env.JWT_SECRET, { expiresIn: "2w"})

        res.cookie('hakim-livs-token', token)

        res.json({
            user: toUserDTO(newUser),
            token
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error?.message })
    }
})

testUsersRouter.post('/users/login', async (req, res) => {
    try {
        const foundUser = await User.findOne({ email: req.body.email }).lean()
        if (!foundUser) throw { message: "Email doesn't match any documents." };
        const validPassword = await bcrypt.compare(req.body.password, foundUser.password)
        if (!validPassword) throw { message: "Password is wrong." }
        const token = jwt.sign(toUserDTO(foundUser), process.env.JWT_SECRET || "livs-hakim", { expiresIn: "2w"})
        res.cookie('hakim-livs-token', token)

        res.json({
            user: toUserDTO(foundUser),
            token
        })
    } catch (error) {
        res.status(400)
        res.json({ error: error?.message })
        return
    }
})

testUsersRouter.get('/users/me', async (req, res) => {
    try {
        const token = req.cookies['hakim-livs-token']
        if (!token) throw { message: "You do not have a cookie called 'hakim-livs-token'." }

        // verify token
        const userData = jwt.verify(token, process.env.JWT_SECRET || "livs-hakim")

        // find user
        const foundUser = await User.findOne({ email: userData.email })
        if (!foundUser) throw { message: "The cookie contained a valid token but it did not reference an existing user. Maybe the user no longer exists, or has changed their email." };

        res.json(toUserDTO(foundUser))

    } catch (error) {
        res.status(400)
        res.json({ error: error?.message })
    }
})

testUsersRouter.get('/users/logout', async (req, res) => {
    res.cookie('hakim-livs-token', '')
    res.json({ message: 'Your cookie has been deleted' })
})

export default testUsersRouter