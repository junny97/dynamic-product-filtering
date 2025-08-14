import { createFileRoute } from '@tanstack/react-router';
import {
  createProductsInfiniteQueryOptions,
  useProductsSuspenseInfiniteQuery,
} from '../features/products/use-products.query';
import { ProductList } from '../features/products/components/ProductList';
import { InfiniteScroll } from '../components/InfiniteScroll';

const pageLimit = { limit: 12 };

export const Route = createFileRoute('/')({
  loader: ({ context }) =>
    context.queryClient.ensureInfiniteQueryData(
      createProductsInfiniteQueryOptions(pageLimit)
    ),
  component: Index,
});

function Index() {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useProductsSuspenseInfiniteQuery(pageLimit);

  const productsData = data.pages.flatMap((p) => p.products);

  return (
    <div className='p-4'>
      <h2 className='mb-4 text-xl font-semibold'>Products</h2>
      <InfiniteScroll
        onLoadMore={
          hasNextPage && !isFetchingNextPage ? () => fetchNextPage() : undefined
        }
      >
        <ProductList products={productsData} />
      </InfiniteScroll>
    </div>
  );
}
