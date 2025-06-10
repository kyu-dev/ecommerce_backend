// @ts-nocheck 
import { Request, Response, NextFunction } from 'express'
import passport from '../auth/passport'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import prisma from '../db/prismaClient'
import { User } from '@prisma/client'

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET as string

export function login(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('local', { session: false }, (err: Error | null, user: User | false, info: { message: string } | undefined) => {
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

export async function register(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const { name, email, password } = req.body

        // Vérifie que tous les champs sont présents
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Tous les champs sont requis' })
        }

        // Vérifie si l'utilisateur existe déjà
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return res.status(409).json({ message: 'Cet email est déjà utilisé' })
        }

        // Hash le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10) // le serano est très salé johan

        // Crée l'utilisateur
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

}