import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import { getCart } from "@/controllers/cartController";
import prisma from "@/db/prismaClient";

vi.mock("@/db/prismaClient", () => ({
  default: {
    cart: {
      findUnique: vi.fn(),
    },
  },
}));

const mockedPrisma = prisma as any;

const app = express();
app.use(express.json());
app.get("/cart/:userId", getCart as any);

//test pour la route de récupération du panier de l'utilisataeur
describe("GET /cart/:userId", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retourne 404 si le panier n'existe pas", async () => {
    mockedPrisma.cart.findUnique.mockResolvedValue(null);

    const res = await request(app).get("/cart/1");

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/Panier non trouvé/i);
  });

  it("retourne 200 si le panier existe", async () => {
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

    const res = await request(app).get("/cart/1");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch("Récupération du panier");
  });

  it("retourne 200 si le panier est vide ", async () => {
    mockedPrisma.cart.findUnique.mockResolvedValue({
      id: 1,
      userId: 1,
      items: [],
    });
    const res = await request(app).get("/cart/1");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch("Le panier est vide");
  });
});
