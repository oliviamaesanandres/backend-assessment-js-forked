interface ProductVariant {
  title: string;
  sku: string;
}

interface Product {
  id: number;
  title: string;
  variants: ProductVariant[];
  tags: string;
  created_at: string;
  updated_at: string;
}

interface TransformedProduct {
  ProductID: number;
  Title: string;
  Tags: string;
  CreatedAt: string;
  UpdatedAt: string;
  ProductCode: string;
}

interface APIResponse {
  status: string;
  message?: string;
  metrics?: any;
  details?: any;
}
