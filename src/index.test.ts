import { unstable_dev } from "wrangler";
import type { UnstableDevWorker } from "wrangler";
import { describe, expect, it, beforeAll, afterAll } from "vitest";

interface ApiResponse {
  message?: string;
  products?: DisplayProduct[];
  error?: string;
}

interface DisplayProduct {
  ProductID: string;
  Title: string;
  Tags: string;
  CreatedAt: Date;
  UpdatedAt: Date;
  ProductCode: string;
}

describe("Worker", () => {
  let worker: UnstableDevWorker;

  beforeAll(async () => {
    worker = await unstable_dev("src/index.ts", {
      experimental: { disableExperimentalWarning: true },
    });
  });

  afterAll(async () => {
    await worker.stop();
  });

  it("GET /api/products - should fetch and insert products", async () => {
    const response = await worker.fetch("/api/products");
    const jsonResponse = (await response.json()) as ApiResponse;

    expect(response.status).toBe(200);
    expect(jsonResponse.message).toEqual("Products inserted successfully");
  });

  it("POST /api/products - should fetch products and return them", async () => {
    const response = await worker.fetch("/api/products", {
      method: "POST",
    });
    const jsonResponse = (await response.json()) as any;
    console.log("jsonResponse", jsonResponse);

    expect(response.status).toBe(200);
    expect(Array.isArray(jsonResponse.products)).toBe(true);
  });

  it("DELETE /api/products/:product_id - should delete a product", async () => {
    const productId = "9505912324385";
    const response = await worker.fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });
    const jsonResponse = (await response.json()) as ApiResponse;

    expect(response.status).toBe(200);
    expect(jsonResponse.message).toEqual("Product deleted successfully");
  });

  it("PUT /api/products - should update product titles", async () => {
    const response = await worker.fetch("/api/products", {
      method: "PUT",
    });
    const jsonResponse = (await response.json()) as ApiResponse;

    expect(response.status).toBe(200);
    expect(jsonResponse.message).toEqual("Products updated successfully");
  });

  it("GET /api/products - should return 404 for non-existent route", async () => {
    const response = await worker.fetch("/api/non-existent-route");
    expect(response.status).toBe(404);
  });
});
