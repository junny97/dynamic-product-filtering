import axios from 'axios';
import type {
  GetProductsParams,
  Product,
  ProductListResponse,
  Category,
} from './products.type';

const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
});

export async function fetchProducts(
  params: GetProductsParams
): Promise<ProductListResponse> {
  const { limit, skip, category } = params;

  // 카테고리가 있으면 카테고리별 상품 조회, 없으면 전체 상품 조회
  const url = category ? `/products/category/${category}` : '/products';
  const response = await apiClient.get(url, {
    params: { limit, skip },
  });
  return response.data;
}

export async function fetchProductById(productId: number): Promise<Product> {
  const response = await apiClient.get(`/products/${productId}`);
  return response.data;
}

export async function fetchCategories(): Promise<Category[]> {
  const response = await apiClient.get('/products/category-list');
  return response.data;
}
