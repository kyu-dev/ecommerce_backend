import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";

import { getCart } from "../src/controllers/cartController.js";
import prisma from "../src/db/prismaClient.js";

// Mock prisma
vi.mock("../src/db/prismaClient.js", () => ({
  default: {
    cart: {
      findUnique: vi.fn(),
    },
  },
}));

const app = express();
app.use(express.json());
app.get("/cart/:userId", getCart);

describe("GET /cart/:userId", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retourne 404 si le panier n'existe pas", async () => {
    prisma.cart.findUnique.mockResolvedValue(null);

    const res = await request(app).get("/cart/1");

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/Panier non trouvé/i);
  });
});
