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

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: () => (
      <>
        <div className='p-2 flex gap-2'>
          <Link to='/' className='[&.active]:font-bold'>
            Home
          </Link>{' '}
          <Link to='/about' className='[&.active]:font-bold'>
            About
          </Link>
        </div>
        <hr />
        <ErrorBoundary FallbackComponent={ErrorFallbackUI}>
          <Suspense
            fallback={
              <div className='p-4 text-slate-600'>Loading products...</div>
            }
          >
            <Outlet />
          </Suspense>
        </ErrorBoundary>
        <TanStackRouterDevtools />
      </>
    ),
  }
);
