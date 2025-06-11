import express from "express";
import auth from "./routes/authRoute.js";
import passport from './auth/passport.js';
import { errorHandler } from "./middleware/errorHandler.js";
import prisma from "./db/prismaClient.js"; //pour des query au pif


const app = express();
const PORT = 3000;
app.use(express.json())
app.use(passport.initialize())
app.use(errorHandler)
app.use("/authentication", auth)

app.get(
  '/private',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.send(`Bonjour c'est secret ici !`)
  }
)


const users = await prisma.user.findMany();
console.log(users);

app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
