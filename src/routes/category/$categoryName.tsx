import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { z } from 'zod';
import { useState } from 'react';
import {
  createProductsInfiniteQueryOptions,
  useProductsSuspenseInfiniteQuery,
  createCategoriesQueryOptions,
} from '../../features/products/use-products.query';
import { ProductList } from '../../features/products/components/ProductList';
import { InfiniteScroll } from '../../components/InfiniteScroll';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { formatCategoryName, getCategoryEmoji } from '../../utils/utliFn';

const pageLimit = { limit: 12 };

export const Route = createFileRoute('/category/$categoryName')({
  params: {
    parse: (params) => ({
      categoryName: z.string().parse(params.categoryName),
    }),
  },
  loader: async ({ context, params }) => {
    // 카테고리 목록을 먼저 확인
    const categories = await context.queryClient.ensureQueryData(
      createCategoriesQueryOptions()
    );

    // 유효하지 않은 카테고리면 404
    if (!categories.includes(params.categoryName)) {
      throw notFound();
    }

    // 해당 카테고리 상품 로드
    await context.queryClient.ensureInfiniteQueryData(
      createProductsInfiniteQueryOptions({
        ...pageLimit,
        category: params.categoryName,
      })
    );
  },
  component: CategoryPage,
  notFoundComponent: () => {
    return (
      <div className='max-w-2xl mx-auto p-8 text-center'>
        <div className='bg-gray-50 rounded-2xl p-12'>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>
            카테고리를 찾을 수 없습니다
          </h1>
          <p className='text-gray-600 mb-8'>
            요청하신 카테고리가 존재하지 않습니다.
          </p>
          <div className='flex gap-4 justify-center'>
            <Link to='/'>
              <Button variant='outline'>홈으로 가기</Button>
            </Link>
            <Link to='/category'>
              <Button>전체 카테고리 보기</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  },
});

function CategoryPage() {
  const { categoryName } = Route.useParams();
  const [sortBy, setSortBy] = useState<
    'default' | 'price-low' | 'price-high' | 'rating'
  >('default');

  // 카테고리별 상품 조회
  const queryParams = { ...pageLimit, category: categoryName };
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useProductsSuspenseInfiniteQuery(queryParams);

  const productsData = data.pages.flatMap((p) => p.products);

  // 정렬된 상품 데이터
  const sortedProducts = [...productsData].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className='max-w-7xl mx-auto p-4'>
      {/* 카테고리 헤더 */}
      <CategoryHeader
        categoryName={categoryName}
        productCount={productsData.length}
      />

      {/* 정렬 옵션 */}
      <SortOptions sortBy={sortBy} onSortChange={setSortBy} />

      {/* 상품 목록 */}
      <InfiniteScroll
        onLoadMore={
          hasNextPage && !isFetchingNextPage ? () => fetchNextPage() : undefined
        }
      >
        <ProductList products={sortedProducts} />
      </InfiniteScroll>

      {/* 로딩 인디케이터 */}
      {isFetchingNextPage && (
        <div className='flex justify-center py-4'>
          <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600'></div>
        </div>
      )}
    </div>
  );
}

type CategoryHeaderProps = {
  categoryName: string;
  productCount: number;
};

function CategoryHeader({ categoryName, productCount }: CategoryHeaderProps) {
  return (
    <div className='mb-6'>
      {/* 브레드크럼 */}
      <nav className='flex items-center gap-2 text-sm text-gray-600 mb-4'>
        <Link to='/' className='hover:text-blue-600'>
          홈
        </Link>
        <span>›</span>
        <Link to='/category' className='hover:text-blue-600'>
          카테고리
        </Link>
        <span>›</span>
        <span className='text-gray-900 font-medium'>
          {formatCategoryName(categoryName)}
        </span>
      </nav>

      {/* 카테고리 제목 */}
      <div className='flex items-center gap-4 mb-4'>
        <span className='text-4xl'>{getCategoryEmoji(categoryName)}</span>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            {formatCategoryName(categoryName)}
          </h1>
          <p className='text-gray-600 mt-1'>
            {productCount}개의 상품을 찾았습니다
          </p>
        </div>
      </div>

      {/* 카테고리 배지 */}
      <Badge variant='secondary' className='mb-4'>
        {formatCategoryName(categoryName)} 전용 상품
      </Badge>
    </div>
  );
}

type SortOptionsProps = {
  sortBy: 'default' | 'price-low' | 'price-high' | 'rating';
  onSortChange: (
    sort: 'default' | 'price-low' | 'price-high' | 'rating'
  ) => void;
};

function SortOptions({ sortBy, onSortChange }: SortOptionsProps) {
  const sortOptions = [
    { value: 'default', label: '기본순' },
    { value: 'price-low', label: '가격 낮은순' },
    { value: 'price-high', label: '가격 높은순' },
    { value: 'rating', label: '평점순' },
  ] as const;

  return (
    <div className='flex items-center justify-between mb-6 pb-4 border-b border-gray-200'>
      <div className='flex items-center gap-2'>
        <span className='text-sm font-medium text-gray-700'>정렬:</span>
        <div className='flex gap-2'>
          {sortOptions.map((option) => (
            <Button
              key={option.value}
              variant={sortBy === option.value ? 'default' : 'outline'}
              size='sm'
              onClick={() => onSortChange(option.value)}
              className='text-xs'
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div className='flex items-center gap-4'>
        <Link to='/category'>
          <Button variant='outline' size='sm'>
            다른 카테고리 보기
          </Button>
        </Link>
      </div>
    </div>
  );
}
