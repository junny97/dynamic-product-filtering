import {
  infiniteQueryOptions,
  queryOptions,
  useQuery,
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  fetchProductById,
  fetchProducts,
  fetchCategories,
} from './products.api';
import type {
  GetProductsParams,
  Product,
  ProductListResponse,
  Category,
} from './products.type';
import { DEFAULT_STALE_TIME } from '@/utils/constant';

export type ProductsInfiniteParams = Pick<GetProductsParams, 'limit'> & {
  category?: string;
};

export function createProductsInfiniteQueryOptions(
  params: ProductsInfiniteParams
) {
  const { limit, category } = params;
  return infiniteQueryOptions<ProductListResponse>({
    queryKey: ['products', limit, category],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      fetchProducts({ limit, skip: pageParam as number, category }),
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
    staleTime: DEFAULT_STALE_TIME,
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
    staleTime: DEFAULT_STALE_TIME,
  });
}

export function useProductByIdQuery(productId: number) {
  return useQuery(createProductByIdQueryOptions(productId));
}

export function createCategoriesQueryOptions() {
  return queryOptions<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: DEFAULT_STALE_TIME,
  });
}

export function useCategoriesSuspenseQuery() {
  return useSuspenseQuery(createCategoriesQueryOptions());
}
