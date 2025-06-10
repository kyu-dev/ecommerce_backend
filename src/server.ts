import express from "express";
import auth from "./routes/authRoute";

const app = express();
const PORT = 3000;

app.use("/auth", auth);


app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
