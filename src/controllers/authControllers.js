// @ts-nocheck 
import passport from '../auth/passport.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import prisma from '../db/prismaClient.js'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

export function login(req, res, next) {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) return next(err)
        if (!user) return res.status(401).json({ message: info?.message || 'Auth failed' })

        const payload = {
            id: user.id,
            email: user.email,
        }

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })

        return res.json({ token })
    })(req, res, next)
}

export async function register(req, res, next) {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Tous les champs sont requis' })
        }

        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return res.status(409).json({ message: 'Cet email est déjà utilisé' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        })

        res.status(201).json(newUser)
    } catch (error) {
        next(error)
    }
}

export default function loginWithGoogle(req, res, next) {
    // à implémenter plus tard
}