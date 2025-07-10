"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const cartController_1 = require("../src/controllers/cartController");
const prismaClient_1 = __importDefault(require("../src/db/prismaClient"));
vitest_1.vi.mock("@/db/prismaClient", () => ({
    default: {
        cart: {
            findUnique: vitest_1.vi.fn(),
        },
    },
}));
const mockedPrisma = prismaClient_1.default;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/cart/:userId", cartController_1.getCart);
//test pour la route de récupération du panier de l'utilisataeur
(0, vitest_1.describe)("GET /cart/:userId", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("retourne 404 si le panier n'existe pas", async () => {
        mockedPrisma.cart.findUnique.mockResolvedValue(null);
        const res = await (0, supertest_1.default)(app).get("/cart/1");
        (0, vitest_1.expect)(res.statusCode).toBe(404);
        (0, vitest_1.expect)(res.body.message).toMatch(/Panier non trouvé/i);
    });
    (0, vitest_1.it)("retourne 200 si le panier existe", async () => {
        mockedPrisma.cart.findUnique.mockResolvedValue({
            id: 1,
            userId: 1,
            items: [
                {
                    id: 1,
                    productId: 1,
                    quantity: 2,
                    product: {
                        id: 1,
                        name: "Produit Test",
                        price: 19.99,
                    },
                },
            ],
        });
        const res = await (0, supertest_1.default)(app).get("/cart/1");
        (0, vitest_1.expect)(res.statusCode).toBe(200);
        (0, vitest_1.expect)(res.body.message).toMatch("Récupération du panier");
    });
    (0, vitest_1.it)("retourne 200 si le panier est vide ", async () => {
        mockedPrisma.cart.findUnique.mockResolvedValue({
            id: 1,
            userId: 1,
            items: [],
        });
        const res = await (0, supertest_1.default)(app).get("/cart/1");
        (0, vitest_1.expect)(res.statusCode).toBe(200);
        (0, vitest_1.expect)(res.body.message).toMatch("Le panier est vide");
    });
});
