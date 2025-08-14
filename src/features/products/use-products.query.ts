import {
  infiniteQueryOptions,
  queryOptions,
  useQuery,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';
import { fetchProductById, fetchProducts } from './products.api';
import type {
  GetProductsParams,
  Product,
  ProductListResponse,
} from './products.type';

export type ProductsInfiniteParams = Pick<GetProductsParams, 'limit'>;

export function createProductsInfiniteQueryOptions(
  params: ProductsInfiniteParams
) {
  const { limit } = params;
  return infiniteQueryOptions<ProductListResponse>({
    queryKey: ['products', limit],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      fetchProducts({ limit, skip: pageParam as number }),
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
    staleTime: 1000 * 60,
  });
}

export function useProductsSuspenseInfiniteQuery(
  params: ProductsInfiniteParams
) {
  return useSuspenseInfiniteQuery(createProductsInfiniteQueryOptions(params));
}

export function createProductByIdQueryOptions(productId: number) {
  return queryOptions<Product>({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId),
  });
}

export function useProductByIdQuery(productId: number) {
  return useQuery(createProductByIdQueryOptions(productId));
}
