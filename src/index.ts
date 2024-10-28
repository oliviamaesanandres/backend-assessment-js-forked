import { Router } from "itty-router";
import { DatabaseError } from "../util/error";
import { query } from "../util/db";
import { downstreamMiddleware, upstreamMiddleware } from "../util/middleware";
import { Metrics } from "../util/metrics";
import ProductService from "../util/services";

const router = Router({
  before: [upstreamMiddleware],
  finally: [downstreamMiddleware],
});

router.get("/api/products", async (request, env) => {
  const startTime = request?.startTime || Date.now();

  let responseObj: APIResponse = {
    status: "success",
    message: "Products inserted successfully",
  };

  try {
    const res = await ProductService.createProductTable(env.DATABASE_URL);
    console.log("Result", res);
    const response = await fetch(
      "https://02557f4d-8f03-405d-a4e7-7a6483d26a04.mock.pstmn.io/get"
    );

    if (!response.ok) {
      responseObj.status = "error";
      responseObj.message = `External API returned ${response.status}`;
      return new Response(JSON.stringify({ ...responseObj }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const data: any = await response.json();

    const results = await ProductService.batchInsertProducts(
      data,
      env.DATABASE_URL
    );

    const successCount = results.filter((r) => r.status === "fulfilled").length;
    const failureCount = results.filter((r) => r.status === "rejected").length;

    Metrics.getInstance().incrementCounter("products_processed");
    Metrics.getInstance().recordTiming(
      "total_processing_time",
      Date.now() - startTime
    );

    responseObj.metrics = {
      successCount,
      failureCount,
      processingTimeMs: Date.now() - startTime,
      ...Metrics.getInstance().getMetrics(),
    };

    return new Response(JSON.stringify({ ...responseObj }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    Metrics.getInstance().incrementCounter("error_count");
    responseObj.status = "error";
    responseObj.message = "Internal server error";
    responseObj.details =
      error instanceof Error ? error.message : "Unknown error";

    if (error instanceof DatabaseError) {
      responseObj.message = "Database operation failed";
    }

    return new Response(JSON.stringify({ ...responseObj }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
});

router.post("/api/products", async (request, env) => {
  const startTime = request?.startTime || Date.now();

  let responseObj: APIResponse & { products?: Array<TransformedProduct> } = {
    status: "success",
    message: "Products inserted successfully",
  };

  try {
    const response = await fetch(
      "https://02557f4d-8f03-405d-a4e7-7a6483d26a04.mock.pstmn.io/getProducts"
    );

    if (!response.ok) {
      responseObj.status = "error";
      responseObj.message = `External API returned ${response.status}`;
      return new Response(JSON.stringify({ ...responseObj }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const data: any = await response.json();

    const results = await ProductService.batchInsertProducts(
      data,
      env.DATABASE_URL
    );

    const successCount = results.filter((r) => r.status === "fulfilled").length;
    const failureCount = results.filter((r) => r.status === "rejected").length;

    Metrics.getInstance().incrementCounter("products_processed");
    Metrics.getInstance().recordTiming(
      "total_processing_time",
      Date.now() - startTime
    );

    const dbResponse = await ProductService.fetchProducts(
      true,
      env.DATABASE_URL
    );

    responseObj.metrics = {
      successCount,
      failureCount,
      processingTimeMs: Date.now() - startTime,
      ...Metrics.getInstance().getMetrics(),
    };
    responseObj.products = dbResponse.rows;

    return new Response(JSON.stringify({ ...responseObj }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    Metrics.getInstance().incrementCounter("error_count");
    responseObj.status = "error";
    responseObj.message = "Internal server error";
    responseObj.details =
      error instanceof Error ? error.message : "Unknown error";

    if (error instanceof DatabaseError) {
      responseObj.message = "Database operation failed";
    }

    return new Response(JSON.stringify({ ...responseObj }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
});

router.delete("/api/products/:product_id", async (request, env) => {
  const startTime = request?.startTime || Date.now();
  const { product_id } = request?.params;

  let responseObj: APIResponse = {
    status: "success",
    message: "Product deleted successfully",
  };

  try {
    const result: any = await ProductService.deleteProduct(
      product_id,
      env.DATABASE_URL
    );

    const successCount = result.rowCount > 0 ? 1 : 0;
    const failureCount = result.rowCount === 0 ? 1 : 0;

    Metrics.getInstance().incrementCounter("products_processed");
    Metrics.getInstance().recordTiming(
      "total_processing_time",
      Date.now() - startTime
    );

    responseObj.metrics = {
      successCount,
      failureCount,
      processingTimeMs: Date.now() - startTime,
      ...Metrics.getInstance().getMetrics(),
    };

    if (result.rowCount === 0) {
      responseObj.status = "error";
      responseObj.message = "Product not found";
      return new Response(JSON.stringify({ ...responseObj }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify({ ...responseObj }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    Metrics.getInstance().incrementCounter("error_count");
    responseObj.status = "error";
    responseObj.message = "Internal server error";
    responseObj.details =
      error instanceof Error ? error.message : "Unknown error";

    if (error instanceof DatabaseError) {
      responseObj.message = "Database operation failed";
    }

    return new Response(JSON.stringify({ ...responseObj }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
});

router.put("/api/products", async (request, env) => {
  const startTime = request?.startTime || Date.now();

  let responseObj: APIResponse = {
    status: "success",
    message: "Products updated successfully",
  };

  try {
    const products = await ProductService.fetchProducts(
      false,
      env.DATABASE_URL
    );

    const results = await ProductService.updateAllProducts(
      products,
      env.DATABASE_URL
    );

    const successCount = results.filter((r) => r.status === "fulfilled").length;
    const failureCount = results.filter((r) => r.status === "rejected").length;

    Metrics.getInstance().incrementCounter("products_processed");
    Metrics.getInstance().recordTiming(
      "total_processing_time",
      Date.now() - startTime
    );

    responseObj.metrics = {
      successCount,
      failureCount,
      processingTimeMs: Date.now() - startTime,
      ...Metrics.getInstance().getMetrics(),
    };

    return new Response(JSON.stringify({ ...responseObj }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    Metrics.getInstance().incrementCounter("error_count");
    responseObj.status = "error";
    responseObj.message = "Internal server error";
    responseObj.details =
      error instanceof Error ? error.message : "Unknown error";

    if (error instanceof DatabaseError) {
      responseObj.message = "Database operation failed";
    }

    return new Response(JSON.stringify({ ...responseObj }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
});

router.get("/health", async (request, env) => {
  let responseObj: APIResponse & { timestamp?: string } = {
    status: "success",
    details: "Health check endpoint",
  };

  try {
    await query(`SELECT 1`, [], env.DATABASE_URL);

    responseObj.metrics = Metrics.getInstance().getMetrics();
    responseObj.timestamp = new Date().toISOString();

    return new Response(JSON.stringify({ ...responseObj }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    Metrics.getInstance().incrementCounter("error_count");
    responseObj.status = "error";
    responseObj.message = "Internal server error";
    responseObj.details =
      error instanceof Error ? error.message : "Unknown error";

    return new Response(JSON.stringify({ ...responseObj }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
});

router.all(
  "*",
  () =>
    new Response("Not Found", {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    })
);

export default {
  ...router,
};
