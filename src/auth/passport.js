import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import bcrypt from 'bcrypt'
import prisma from '../db/prismaClient.js'
import dotenv from 'dotenv'
import GoogleStrategy from 'passport-google-oauth20'
import jwt from 'jsonwebtoken';

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'ton_secret_par_defaut'

// Stratégie locale pour la connexion (email + mdp)
passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',  //on remplace la config de base username par email
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

// Stratégie Google Oauth 
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/authentication/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({
          where: { google_id: profile.id },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
              name: profile.displayName,
              google_id: profile.id,
            },
          });
        }

        const token = jwt.sign({ id: user.id }, "your-secret-key", {
          expiresIn: "24h",
        });

        return done(null, { user, token });
      } catch (error) {
        done(error);
      }
    }
  )
);




export default passport