import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallbackUI from '../components/ErrorFallbackUI';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useCartStore } from '../features/products/product.store';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: () => (
      <>
        <AppNavigation />
        <ErrorBoundary FallbackComponent={ErrorFallbackUI}>
          <Suspense
            fallback={
              <div className='p-4 text-slate-600'>Loading products...</div>
            }
          >
            <Outlet />
          </Suspense>
        </ErrorBoundary>{' '}
        <TanStackRouterDevtools />
      </>
    ),
  }
);
function AppNavigation() {
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <header className='bg-white border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center gap-8'>
            <Link to='/' className='text-xl font-bold text-gray-900'>
              🛍️ Shop
            </Link>
            <nav className='flex items-center gap-6'>
              <Link
                to='/'
                className='[&.active]:font-bold [&.active]:text-blue-600 text-gray-700 hover:text-blue-600 transition-colors'
              >
                상품목록
              </Link>
              <Link
                to='/about'
                className='[&.active]:font-bold [&.active]:text-blue-600 text-gray-700 hover:text-blue-600 transition-colors'
              >
                About
              </Link>
            </nav>
          </div>

          <Link
            to='/cart'
            className='relative inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors [&.active]:text-blue-600'
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a1 1 0 001 1h1M9 19a1 1 0 002 0m0 0a1 1 0 002 0m-2 0h2m-2 0v-2m0 0V9a1 1 0 012 0v8'
              />
            </svg>
            <span className='font-medium'>장바구니</span>
            {totalItems > 0 && (
              <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'>
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
