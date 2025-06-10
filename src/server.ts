import express from "express";
import auth from "./routes/authRoute";
import passport from './auth/passport';
import { errorHandler } from "./middleware/errorHandler";


const app = express();
const PORT = 3000;
app.use(express.json())
app.use(passport.initialize())
app.use(errorHandler)
app.use("/auth", auth)

app.get(
  '/private',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.send(`Bonjour c'est secret ici !`)
  }
)

app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
