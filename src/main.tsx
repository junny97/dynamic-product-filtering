import { createRoot } from 'react-dom/client';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';

// Create a new router instance with context for loaders/actions
const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultErrorComponent: () => <div>Error</div>,
  defaultPendingComponent: () => (
    <div className='flex items-center justify-center h-screen'>
      <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900'></div>
    </div>
  ),
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={false} />
    <RouterProvider router={router} />
    <Toaster position='top-center' richColors />
  </QueryClientProvider>
);
