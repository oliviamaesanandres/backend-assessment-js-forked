import { query } from "./db";

const createProductTable = async (connectionString: string) => {
  const result = await query(
    `CREATE TABLE IF NOT EXISTS products (
            id BIGINT PRIMARY KEY,
            title TEXT,
            tags TEXT,
            created_at TIMESTAMP,
            updated_at TIMESTAMP,
            sku TEXT
        );`,
    [],
    connectionString
  );

  return result;
};

const batchInsertProducts = async (data: any, connectionString: string) => {
  const result = await Promise.allSettled(
    data?.products.map(async (product: any) => {
      const variantTitles = product.variants
        .map((v: ProductVariant) => v.title)
        .join(", ");
      const combinedTitle = `${product.title} - ${variantTitles}`;
      const sku = product.variants[0]?.sku || "";

      await query(
        `INSERT INTO products (id, title, tags, created_at, updated_at, sku)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (id) DO NOTHING`,
        [
          product.id,
          combinedTitle,
          product.tags,
          new Date(product.created_at),
          new Date(product.updated_at),
          sku,
        ],
        connectionString
      );
    })
  );

  return result;
};

const fetchProducts = async (
  isTransformedResponse: boolean,
  connectionString: string
) => {
  let queryString = `SELECT id, title, sku FROM products`;

  if (isTransformedResponse) {
    queryString = `SELECT id AS "ProductID", title AS "Title", tags AS "Tags", 
        created_at AS "CreatedAt", updated_at AS "UpdatedAt", sku AS "ProductCode"
        FROM products`;
  }

  const result = await query(queryString, [], connectionString);

  return result;
};

const deleteProduct = async (product_id: string, connectionString: string) => {
  const result: any = await query(
    `DELETE FROM products WHERE id = $1 RETURNING *`,
    [product_id],
    connectionString
  );

  return result;
};

const updateAllProducts = async (products: any, connectionString: string) => {
  const results = await Promise.allSettled(
    products.rows.map((product: any) => {
      const updatedTitle = `${product.title} - ${product.sku}`;
      return query(
        `UPDATE products SET title = $1 WHERE id = $2`,
        [updatedTitle, product.id],
        connectionString
      );
    })
  );

  return results;
};

const ProductService = {
  createProductTable,
  batchInsertProducts,
  fetchProducts,
  deleteProduct,
  updateAllProducts,
};

export default ProductService;
