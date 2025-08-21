import { createFileRoute, Link } from '@tanstack/react-router';
import {
  createCategoriesQueryOptions,
  useCategoriesSuspenseQuery,
} from '../../features/products/use-products.query';
import { Badge } from '../../components/ui/badge';
import { formatCategoryName, getCategoryEmoji } from '../../utils/utliFn';

export const Route = createFileRoute('/category/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(createCategoriesQueryOptions()),
  component: CategoryListPage,
});

function CategoryListPage() {
  const { data: categories } = useCategoriesSuspenseQuery();

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>전체 카테고리</h1>
        <p className='text-gray-600'>
          원하는 카테고리를 선택해서 관련 상품들을 둘러보세요
        </p>
      </div>

      {/* 카테고리 그리드 */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {categories.map((category) => (
          <CategoryCard key={category} category={category} />
        ))}
      </div>

      {/* 통계 정보 */}
      <div className='mt-12 bg-gray-50 rounded-lg p-6'>
        <div className='text-center'>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            총 {categories.length}개의 카테고리
          </h3>
          <p className='text-gray-600'>
            다양한 카테고리에서 원하는 상품을 찾아보세요
          </p>
        </div>
      </div>
    </div>
  );
}

type CategoryCardProps = {
  category: string;
};

function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to='/category/$categoryName'
      params={{ categoryName: category }}
      className='block group'
    >
      <div className='bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 group-hover:scale-105'>
        <div className='text-center'>
          <div className='text-4xl mb-3'>{getCategoryEmoji(category)}</div>
          <h3 className='text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600'>
            {formatCategoryName(category)}
          </h3>
          <Badge variant='outline' className='text-xs'>
            상품 보기
          </Badge>
        </div>
      </div>
    </Link>
  );
}
