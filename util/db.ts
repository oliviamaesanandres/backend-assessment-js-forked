import { Pool } from "@neondatabase/serverless";
import { DatabaseError } from "./error";
import { Logger } from "./logger";
import { Metrics } from "./metrics";

// Wrapper for running queries
export async function query(
  text: string,
  params: any[] = [],
  connectionString: string
) {
  // Initialize a new pool for each query to avoid persistent I/O state
  const pool = new Pool({ connectionString });
  const client = await pool.connect();

  const startTime = Date.now();
  try {
    const result = await client.query(text, params);
    Metrics.getInstance().recordTiming("db_query_time", Date.now() - startTime);
    return result;
  } catch (error) {
    Metrics.getInstance().incrementCounter("db_error_count");
    Logger.error("Database query failed", error as Error, { query, params });
    throw new DatabaseError("Database operation failed", error as Error);
  } finally {
    client.release();
    await pool.end(); // Close the pool after each query
  }
}
