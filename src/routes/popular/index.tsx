import { createFileRoute, Link } from '@tanstack/react-router';
import {
  createProductsInfiniteQueryOptions,
  useProductsSuspenseInfiniteQuery,
} from '../../features/products/use-products.query';
import { ProductList } from '../../features/products/components/ProductList';
import { Button } from '../../components/ui/button';

export const Route = createFileRoute('/popular/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureInfiniteQueryData(
      createProductsInfiniteQueryOptions({ limit: 30 })
    );
  },
  component: PopularPage,
});

function PopularPage() {
  const { data } = useProductsSuspenseInfiniteQuery({ limit: 30 });

  // 모든 상품을 하나의 배열로 합치기
  const allProducts = data.pages.flatMap((page) => page.products);

  const popularProducts = allProducts
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 20);

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header Section */}
      <section className='bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-12'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-4xl font-bold mb-2'>⭐ 오늘의 인기 상품</h1>
              <p className='text-xl text-yellow-100'>
                최고 평점을 자랑하는 고객 만족도 1등 상품들
              </p>
            </div>
            <Link to='/'>
              <Button variant='secondary' size='lg'>
                홈으로 돌아가기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Products Content */}
      <section className='max-w-7xl mx-auto px-4 py-12'>
        <div className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            별점 Top 5 상품
          </h2>
          <p className='text-gray-600'>
            고객들이 가장 만족한 최고 평점 상품들입니다
          </p>
        </div>

        {popularProducts.length > 0 ? (
          <>
            <ProductList products={popularProducts} />

            {/* Stats Section */}
            <div className='mt-12 bg-yellow-50 rounded-lg p-6'>
              <div className='text-center'>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  최고 평점: ⭐{' '}
                  {Math.max(...popularProducts.map((p) => p.rating)).toFixed(1)}
                  점
                </h3>
                <p className='text-gray-600'>
                  평균 평점: ⭐{' '}
                  {(
                    popularProducts.reduce((sum, p) => sum + p.rating, 0) /
                    popularProducts.length
                  ).toFixed(1)}
                  점
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className='text-center py-12'>
            <p className='text-gray-500 text-lg'>상품을 불러올 수 없습니다.</p>
            <Link to='/'>
              <Button className='mt-4'>전체 상품 보기</Button>
            </Link>
          </div>
        )}

        <div className='text-center mt-12'>
          <Link to='/'>
            <Button variant='outline' size='lg'>
              더 많은 상품 둘러보기
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
