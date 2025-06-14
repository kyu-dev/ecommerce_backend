import express from "express";
import auth from "./routes/authRoute.js";
import product from "./routes/productRoutes.js";
import passport from "./auth/passport.js";
import cart from "./routes/cartRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(passport.initialize());
app.use(errorHandler);
app.use(express.json());
app.use("/authentication", auth);
app.use("/product", product);
app.use("/cart", cart);

app.get(
  "/private",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send(`Bonjour c'est secret ici !`);
  }
);

app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
