import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import bcrypt from 'bcrypt'
import prisma from '../db/prismaClient'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'ton_secret_par_defaut'

// Stratégie locale pour la connexion (email + mdp)
passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
        },
        async (email, password, done) => {
            try {
                const user = await prisma.user.findUnique({ where: { email } })

                if (!user) return done(null, false, { message: 'Utilisateur non trouvé' })

                const passwordMatch = await bcrypt.compare(password, user.password)
                if (!passwordMatch) return done(null, false, { message: 'Mot de passe incorrect' })

                return done(null, user)
            } catch (err) {
                return done(err)
            }
        }
    )
)

// Stratégie JWT pour protéger les routes
passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_SECRET,
        },
        async (jwtPayload, done) => {
            try {
                const user = await prisma.user.findUnique({ where: { id: jwtPayload.id } })
                if (user) return done(null, user)
                else return done(null, false)
            } catch (err) {
                return done(err, false)
            }
        }
    )
)

export default passport