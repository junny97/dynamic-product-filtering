import { createFileRoute, Link } from '@tanstack/react-router';
import {
  createProductsInfiniteQueryOptions,
  useProductsSuspenseInfiniteQuery,
} from '../features/products/use-products.query';
import { ProductList } from '../features/products/components/ProductList';
import { InfiniteScroll } from '../components/InfiniteScroll';
import { Button } from '../components/ui/button';

const pageLimit = { limit: 12 };

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    // 홈페이지 상품 목록 프리로드
    await context.queryClient.ensureInfiniteQueryData(
      createProductsInfiniteQueryOptions(pageLimit)
    );
  },
  component: Index,
});

function Index() {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useProductsSuspenseInfiniteQuery(pageLimit);

  const productsData = data.pages.flatMap((p) => p.products);

  return (
    <div className='min-h-screen bg-gray-50'>
      <HeroSection />
      <section className='max-w-7xl mx-auto px-4 py-12'>
        <div className='flex items-center justify-between mb-8'>
          <h2 className='text-2xl font-bold text-gray-900'>전체 상품</h2>
          <Link to='/category'>
            <Button variant='outline'>모든 카테고리 보기</Button>
          </Link>
        </div>

        <InfiniteScroll
          onLoadMore={
            hasNextPage && !isFetchingNextPage
              ? () => fetchNextPage()
              : undefined
          }
        >
          <ProductList products={productsData} />
        </InfiniteScroll>

        {isFetchingNextPage && (
          <div className='flex justify-center py-8'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
          </div>
        )}
      </section>
    </div>
  );
}

function HeroSection() {
  return (
    <section className='bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16'>
      <div className='max-w-7xl mx-auto px-4 text-center'>
        <h1 className='text-4xl md:text-5xl font-bold mb-4'>
          원하는 모든 것을 한 곳에서
        </h1>
        <p className='text-xl md:text-2xl mb-8 text-blue-100'>
          다양한 카테고리의 상품들을 만나보세요
        </p>
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Link to='/hotdeal'>
            <Button size='lg' variant='secondary'>
              🔥 오늘의 핫딜 제품
            </Button>
          </Link>
          <Link to='/popular'>
            <Button size='lg' variant='secondary'>
              ⭐ 오늘의 인기 상품
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
