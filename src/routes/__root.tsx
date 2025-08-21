import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallbackUI from '../components/ErrorFallbackUI';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Header } from '../components/Header';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: () => (
      <>
        <Header />
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
