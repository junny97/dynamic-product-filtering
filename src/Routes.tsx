import { createBrowserRouter } from 'react-router-dom';

import ProductHome from './pages/ProductHome';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProductHome />,
  },
]);

export default router;
