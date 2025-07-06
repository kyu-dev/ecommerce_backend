import express from "express";
import auth from "./routes/authRoute";
import product from "./routes/productRoutes";
import passport from "./auth/passport";
import cart from "./routes/cartRoutes";
import order from "./routes/orderRoutes";
import { errorHandler } from "./middleware/errorHandler";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Ecommerce",
      version: "1.0.0",
      description: "Documentation de l'API Ecommerce",
    },
    servers: [
      {
        url: "http://localhost:3001",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(passport.initialize());
app.use(errorHandler);

app.use("/authentication", auth);
app.use("/product", product);
app.use("/cart", cart);
app.use("/order", order);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
