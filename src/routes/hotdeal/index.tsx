import { createFileRoute, Link } from '@tanstack/react-router';
import {
  createProductsInfiniteQueryOptions,
  useProductsSuspenseInfiniteQuery,
} from '../../features/products/use-products.query';
import { ProductList } from '../../features/products/components/ProductList';
import { Button } from '../../components/ui/button';
import { type TimeLeft } from '@/utils/utliFn';
import { useCountdownTimer } from '../../hooks/use-countdown-timer';

export const Route = createFileRoute('/hotdeal/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureInfiniteQueryData(
      createProductsInfiniteQueryOptions({ limit: 30 })
    );
  },
  component: HotDealsPage,
});

function HotDealsPage() {
  const { data } = useProductsSuspenseInfiniteQuery({ limit: 30 });

  const { timeLeft, isExpired } = useCountdownTimer({
    duration: 480, // 8시간 (480분)
    persistKey: 'hot-deals-timer',
    onExpire: () => {
      console.log('🔥 핫딜이 종료되었습니다!');
    },
  });

  const allProducts = data.pages.flatMap((page) => page.products);

  const hotDealProducts = allProducts
    .filter((product) => product.discountPercentage > 0)
    .sort((a, b) => b.discountPercentage - a.discountPercentage)
    .slice(0, 20);

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header Section */}
      <section className='bg-gradient-to-r from-red-500 to-pink-600 text-white py-12'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
            <div className='flex-1'>
              <h1 className='text-4xl font-bold mb-2'>🔥 오늘의 핫딜</h1>
              <p className='text-xl text-red-100'>
                최고 할인률을 자랑하는 베스트 상품들
              </p>
            </div>

            {/* Timer and Navigation */}
            <div className='flex flex-col sm:flex-row lg:flex-col gap-4 lg:items-end'>
              <CountdownTimer timeLeft={timeLeft} isExpired={isExpired} />
              <Link to='/'>
                <Button
                  variant='secondary'
                  size='lg'
                  className='w-full sm:w-auto'
                >
                  홈으로 돌아가기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Hot Deals Content */}
      <section className='max-w-7xl mx-auto px-4 py-12'>
        <div className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            할인률 Top 20 상품
          </h2>
          <p className='text-gray-600'>
            지금 가장 큰 할인 혜택을 받을 수 있는 상품들입니다
          </p>
        </div>

        {hotDealProducts.length > 0 ? (
          <>
            <ProductList products={hotDealProducts} />

            {/* Stats Section */}
            <div className='mt-12 bg-red-50 rounded-lg p-6'>
              <div className='text-center'>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  최대 할인률:{' '}
                  {Math.max(
                    ...hotDealProducts.map((p) => p.discountPercentage)
                  ).toFixed(0)}
                  %
                </h3>
                <p className='text-gray-600'>
                  평균 할인률:{' '}
                  {(
                    hotDealProducts.reduce(
                      (sum, p) => sum + p.discountPercentage,
                      0
                    ) / hotDealProducts.length
                  ).toFixed(1)}
                  %
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className='text-center py-12'>
            <p className='text-gray-500 text-lg'>
              현재 할인 중인 상품이 없습니다.
            </p>
            <Link to='/'>
              <Button className='mt-4'>전체 상품 보기</Button>
            </Link>
          </div>
        )}

        {/* CTA Section */}
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

type CountdownTimerProps = {
  timeLeft: TimeLeft;
  isExpired: boolean;
};

// 🎨 순수 UI 컴포넌트: props만 받아서 렌더링
function CountdownTimer({ timeLeft, isExpired }: CountdownTimerProps) {
  if (isExpired) {
    return (
      <div className='bg-gray-700 rounded-lg p-4 text-center'>
        <div className='text-red-300 text-sm font-medium mb-1'>
          ⏰ 핫딜 종료
        </div>
        <div className='text-white text-lg font-bold'>
          다음 핫딜을 기다려주세요!
        </div>
      </div>
    );
  }

  return (
    <div className='bg-red-900/30 backdrop-blur-sm rounded-lg p-4 border border-red-400/20'>
      <div className='text-red-100 text-sm font-medium mb-2 text-center'>
        ⏰ 핫딜 종료까지
      </div>
      <div className='flex items-center justify-center gap-2'>
        <TimeUnit value={timeLeft.hours} label='시간' />
        <div className='text-white text-xl font-bold animate-pulse'>:</div>
        <TimeUnit value={timeLeft.minutes} label='분' />
        <div className='text-white text-xl font-bold animate-pulse'>:</div>
        <TimeUnit value={timeLeft.seconds} label='초' />
      </div>
      <div className='text-center mt-2'>
        <span className='text-red-200 text-xs'>놓치면 후회하는 특가!</span>
      </div>
    </div>
  );
}

type TimeUnitProps = {
  value: number;
  label: string;
};

function TimeUnit({ value, label }: TimeUnitProps) {
  return (
    <div className='text-center'>
      <div className='bg-white/10 rounded-md px-2 py-1 min-w-[40px]'>
        <span className='text-white text-lg font-bold tabular-nums'>
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <div className='text-red-200 text-xs mt-1'>{label}</div>
    </div>
  );
}
