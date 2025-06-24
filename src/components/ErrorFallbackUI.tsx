import type { FallbackProps } from 'react-error-boundary';

/**
 * 에러 발생 시 표시할 폴백 UI 컴포넌트
 */
export default function ErrorFallbackUI({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-red-50'>
      <div className='text-center p-8 bg-white rounded-lg shadow-lg max-w-md'>
        <div className='mb-4'>
          <svg
            className='w-16 h-16 mx-auto text-red-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
            />
          </svg>
        </div>

        <h2 className='text-2xl font-bold text-red-600 mb-4'>
          상품 목록을 불러올 수 없습니다.
        </h2>

        <p className='text-gray-600 mb-6'>
          {error.message || '죄송합니다. 현재 상품 목록을 불러올 수 없습니다.'}
        </p>

        <div className='space-y-3'>
          <button
            onClick={resetErrorBoundary}
            className='w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
          >
            다시 시도
          </button>

          <button
            onClick={() => window.location.reload()}
            className='w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors'
          >
            페이지 새로고침
          </button>
        </div>
      </div>
    </div>
  );
}
