import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcrypt'
import prisma from '../db/prismaClient'

passport.use(new LocalStrategy(
    {
        usernameField: 'email'
    },
    async (email, password, done) => {
        try {
            const user = await prisma.user.findFirst(
                { where: { email } },
            );

            if (!user) {
                return done(null, false, { message: "Email incorrect" });
            }
            if (user.password !== password) {
                return done(null, false, { message: "Mot de passe incorrect" });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

export default passport