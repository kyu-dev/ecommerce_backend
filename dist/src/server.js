"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const passport_1 = __importDefault(require("./auth/passport"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const cors_1 = __importDefault(require("cors"));
const orderController_1 = require("./controllers/orderController");
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
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
const app = (0, express_1.default)();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
// D'abord la route webhook, en raw
app.post("/order/webhook", express_1.default.raw({ type: "application/json" }), orderController_1.stripeWebhook);
// Ensuite le reste des middlewares
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(passport_1.default.initialize());
app.use(errorHandler_1.errorHandler);
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:4000",
    credentials: true,
}));
app.use("/authentication", authRoute_1.default);
app.use("/product", productRoutes_1.default);
app.use("/cart", cartRoutes_1.default);
app.use("/category", categoryRoutes_1.default);
app.use("/order", orderRoutes_1.default);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.listen(PORT, () => {
    console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
