# MindArc Backend Assessment

### Author: Olivia San Andres

---

## Table of Contents

1. [Key Components](#key-components)
2. [Setup Instructions](#setup-instructions)
3. [API Documentation](#api-documentation)
4. [Code Structure](#code-structure)
5. [Deployment Guide](#deployment-guide)

## Key Components

- **API Layer**: Cloudflare Workers
- **Database**: Neon Serverless Postgres
- **Router**: Itty Router
- **Test**: Vitest

## Setup Instructions

<b>Note:</b> I have installed wrangler@3.57.1 because I am facing an error when trying to start the app using the current version. You may refer to [this similar issue](https://github.com/cloudflare/workers-sdk/issues/4709#issuecomment-2276281798) for reference.

### Prerequisites

```bash
# Install dependencies
npm install

# Start development server
npm run start
```

### Environment Variables

I have added my env values in _wrangler.toml_ file

```env
DATABASE_URL=postgres://username:password@neon.db/database_name
```

## API Documentation

### Getting Started

### 1. **`export.sql`**

- **Location**: `util/scripts/export.sql`
- **Description**: This SQL file contains the full database schema and initial data inserts. It is intended for setting up the database for the project.
- **Usage**:
  - Use this file to set up the PostgreSQL database with the required tables and data structure.
  - Run the SQL commands in your database client or import directly to prepare the environment for the project.

### 2. **Postman Collection (`mindarc.postman_collection.json`)**

- **Location**: `util/scripts/mindarc.postman_collection.json`
- **Description**: A Postman collection to help you test the API endpoints.
- **Usage**:
  - Import this file into Postman to load pre-configured API requests, which you can use to verify that your routes and database operations are working as expected.

---

### Endpoints

#### GET /api/products

```typescript
/**
 * Fetches and stores products from external API
 *
 * @returns {Promise<Response>} JSON response
 * @throws {DatabaseError} If database operation fails
 *
 * @example
 * // Success Response
 * {
 *     "status": "success",
 *     "message": "Products inserted successfully",
 *     "metrics": {
 *          "successCount": 4,
 *          "failureCount": 0,
 *          "processingTimeMs": 2266,
 *          "db_query_time": 240,
 *          "products_processed": 5,
 *          "total_processing_time": 2266,
 *          "request_duration": 1890
 *      }
 * }
 */
```

#### POST /api/products

```typescript
/**
 * Fetches and stores products from external API and returns a list of Products
 *
 * @returns {Promise<Response>} JSON response
 * @throws {DatabaseError} If database operation fails
 *
 * @example
 * // Success Response
 * {
 *     "status": "success",
 *     "message": "Products inserted successfully",
 *     "metrics": {
 *          "successCount": 6,
 *          "failureCount": 0,
 *          "processingTimeMs": 2266,
 *          "db_query_time": 240,
 *          "products_processed": 5,
 *          "total_processing_time": 2266,
 *          "request_duration": 1890
 *      },
 *      "products": [
 *            {
 *                "ProductID": "9505912553761",
 *                "Title": "The Inventory Not Tracked Snowboard - Default ",
 *                "Tags": "Accessory, Sport, Winter",
 *                "CreatedAt": "2024-06-28T09:31:01.000Z",
 *                "UpdatedAt": "2024-06-28T09:31:02.000Z",
 *                "ProductCode": "sku-untracked-1"
 *            },
 *            {
 *                "ProductID": "9505912455457",
 *                "Title": "The Out of Stock Snowboard - Default Title - oos-1 - ",
 *                "Tags": "Accessory, Sport, Winter",
 *                "CreatedAt": "2024-06-28T09:31:01.000Z",
 *                "UpdatedAt": "2024-06-28T09:31:02.000Z",
 *                "ProductCode": "oos-1"
 *            }
 *      ]
 * }
 */
```

#### DELETE /api/product/:product_id

```typescript
/**
 * Removes a record from the database
 *
 * @returns {Promise<Response>} JSON response
 * @throws {DatabaseError} If database operation fails
 *
 * @example
 * // Success Response
 * {
 *     "status": "success",
 *     "message": "Products inserted successfully",
 *     "metrics": {
 *          "successCount": 1,
 *          "failureCount": 0,
 *          "processingTimeMs": 2266,
 *          "db_query_time": 240,
 *          "products_processed": 5,
 *          "total_processing_time": 2266,
 *          "request_duration": 1890
 *      }
 * }
 *
 * // Product Not Found Response
 * {
 *     "status": "error",
 *     "message": "Product not found",
 *     "metrics": {
 *          "successCount": 0,
 *          "failureCount": 1,
 *          "processingTimeMs": 2266,
 *          "db_query_time": 240,
 *          "products_processed": 5,
 *          "total_processing_time": 2266,
 *          "request_duration": 1890
 *      }
 * }
 */
```

#### PUT /api/products

```typescript
/**
 * Loops through all products in the database and update products in the database table
 *
 * @returns {Promise<Response>} JSON response
 * @throws {DatabaseError} If database operation fails
 *
 * @example
 * // Success Response
 * {
 *     "status": "success",
 *     "message": "Products updated successfully",
 *     "metrics": {
 *          "successCount": 5,
 *          "failureCount": 0,
 *          "processingTimeMs": 2266,
 *          "db_query_time": 240,
 *          "products_processed": 5,
 *          "total_processing_time": 2266,
 *          "request_duration": 1890
 *      }
 * }
 */
```

## Code Structure

```
src/
├── index.test.ts
├── index.ts
util/
├── scripts/
│   ├── create_table.sql
│   ├── export.sql
│   ├── mindarc.postman_collection.json
├── db.ts
├── error.ts
├── logger.ts
├── metrics.ts
├── middleware.ts
├── services.ts
├── types.ts

```

## Deployment Guide

### Production Deployment

```bash
# Deploy to Cloudflare Workers
npm run deploy

# Verify deployment
curl https://ma-project.sanandresoliviamae27.workers.dev/health
```
