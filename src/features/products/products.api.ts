import axios from 'axios';
import type { GetProductsParams, ProductListResponse } from './products.type';

const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
});

export async function fetchProducts(
  params: GetProductsParams
): Promise<ProductListResponse> {
  const { limit, skip } = params;
  const response = await apiClient.get('/products', {
    params: { limit, skip },
  });
  return response.data;
}
