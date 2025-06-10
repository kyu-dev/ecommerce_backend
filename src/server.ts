import express from "express";
import auth from "./routes/authRoute";
import passport from './auth/passport';

const app = express();
const PORT = 3000;
app.use(express.json())
app.use(passport.initialize())

app.use("/auth", auth);

app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
