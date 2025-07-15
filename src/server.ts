import express from "express";
import cookieParser from "cookie-parser";
import auth from "@/routes/authRoute";
import product from "@/routes/productRoutes";
import passport from "@/auth/passport";
import category from "@/routes/categoryRoutes";
import cart from "@/routes/cartRoutes";
import order from "@/routes/orderRoutes";
import { errorHandler } from "@/middleware/errorHandler";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import cors from "cors";
import { stripeWebhook } from "@/controllers/orderController";

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
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:4000",
    credentials: true,
  })
);

// Ajout du middleware pour forcer les bons headers CORS
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.FRONTEND_URL || "http://localhost:4000"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// D'abord la route webhook, en raw
app.post(
  "/order/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// Ensuite le reste des middlewares
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use("/authentication", auth);
app.use("/product", product);
app.use("/cart", cart);
app.use("/category", category);
app.use("/order", order);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handler doit être après les routes
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
