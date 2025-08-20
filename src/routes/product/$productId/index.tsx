import { createFileRoute, redirect, Link } from '@tanstack/react-router';
import { z } from 'zod';
import { useState } from 'react';
import {
  createProductByIdQueryOptions,
  useProductByIdQuery,
} from '../../../features/products/use-products.query';
import { calculateDiscountedPrice } from '../../../utils/utliFn';
import type { Product } from '../../../features/products/products.type';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { useCartStore } from '../../../features/products/product.store';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

type ReviewSortType = 'latest' | 'rating';

export const Route = createFileRoute('/product/$productId/')({
  params: {
    parse: (params) => ({
      productId: z.coerce.number().parse(params.productId),
    }),
  },
  loader: async ({ context, params }) => {
    try {
      await context.queryClient.ensureQueryData(
        createProductByIdQueryOptions(params.productId)
      );
    } catch (error: unknown) {
      console.error(error);
      throw redirect({
        to: '/',
        params: {
          search: {
            error: '상품을 찾을 수 없습니다.',
          },
        },
      });
    }
  },
  component: ProductDetails,
});

type ProductDetailsProps = {
  product: Product;
};

function ProductDetails() {
  const { productId } = Route.useParams();
  const { data: product } = useProductByIdQuery(productId);
  const { addToCart, isInCart, getCartQuantity } = useCartStore(
    useShallow((state) => ({
      addToCart: state.addToCart,
      isInCart: state.isInCart,
      getCartQuantity: state.getCartQuantity,
    }))
  );

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewSortType, setReviewSortType] =
    useState<ReviewSortType>('latest');

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleQuantityIncrease = () => {
    setQuantity((prev) => {
      if (prev < product.stock) {
        return prev + 1;
      }
      return prev;
    });
  };

  const handleQuantityDecrease = () => {
    setQuantity((prev) => {
      if (prev > 1) {
        return prev - 1;
      }
      return prev;
    });
  };

  const handleQuantityChange = (value: string) => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 1) {
      setQuantity(1);
    } else if (numValue > product.stock) {
      setQuantity(product.stock);
    } else {
      setQuantity(numValue);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.title}을 ${quantity}개 장바구니에 추가했습니다.`);
    setQuantity(1);
  };

  const handleReviewSortChange = (sortType: ReviewSortType) => {
    setReviewSortType(sortType);
  };

  return (
    <div className='max-w-7xl mx-auto p-4'>
      <ProductDetailHeader />
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <ProductImageGallery
          product={product}
          selectedImageIndex={selectedImageIndex}
          onImageSelect={handleImageSelect}
        />
        <ProductInfo
          product={product}
          quantity={quantity}
          onQuantityIncrease={handleQuantityIncrease}
          onQuantityDecrease={handleQuantityDecrease}
          onQuantityChange={handleQuantityChange}
          onAddToCart={handleAddToCart}
          isInCart={isInCart(product.id)}
          cartQuantity={getCartQuantity(product.id)}
        />
      </div>
      <ProductReviews
        product={product}
        sortType={reviewSortType}
        onSortChange={handleReviewSortChange}
      />
    </div>
  );
}

function ProductDetailHeader() {
  return (
    <div className='mb-6'>
      <Link
        to='/'
        className='inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
      >
        <svg
          className='w-4 h-4 mr-2'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M15 19l-7-7 7-7'
          />
        </svg>
        <span>상품 목록으로 돌아가기</span>
      </Link>
    </div>
  );
}

type ProductImageGalleryProps = Pick<ProductDetailsProps, 'product'> & {
  selectedImageIndex: number;
  onImageSelect: (index: number) => void;
};

function ProductImageGallery({
  product,
  selectedImageIndex,
  onImageSelect,
}: ProductImageGalleryProps) {
  return (
    <div className='space-y-4'>
      <ProductMainImage
        product={product}
        selectedImageIndex={selectedImageIndex}
      />
      <ProductThumbnails
        product={product}
        selectedImageIndex={selectedImageIndex}
        onImageSelect={onImageSelect}
      />
    </div>
  );
}

type ProductMainImageProps = Pick<ProductDetailsProps, 'product'> & {
  selectedImageIndex: number;
};

function ProductMainImage({
  product,
  selectedImageIndex,
}: ProductMainImageProps) {
  return (
    <div className='aspect-square bg-white rounded-2xl border border-gray-200 overflow-hidden'>
      <img
        src={product.images?.[selectedImageIndex] || product.thumbnail}
        alt={product.title}
        className='w-full h-full object-contain p-4'
      />
    </div>
  );
}

type ProductThumbnailsProps = Pick<ProductDetailsProps, 'product'> & {
  selectedImageIndex: number;
  onImageSelect: (index: number) => void;
};

function ProductThumbnails({
  product,
  selectedImageIndex,
  onImageSelect,
}: ProductThumbnailsProps) {
  if (!product.images || product.images.length <= 1) {
    return null;
  }

  return (
    <div className='flex gap-2 overflow-x-auto'>
      {product.images.map((image, index) => (
        <button
          key={index}
          onClick={() => onImageSelect(index)}
          className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-colors ${
            selectedImageIndex === index
              ? 'border-blue-500'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <img
            src={image}
            alt={`${product.title} ${index + 1}`}
            className='w-full h-full object-contain p-1'
          />
        </button>
      ))}
    </div>
  );
}

type ProductInfoProps = Pick<ProductDetailsProps, 'product'> & {
  quantity: number;
  onQuantityIncrease: () => void;
  onQuantityDecrease: () => void;
  onQuantityChange: (value: string) => void;
  onAddToCart: () => void;
  isInCart: boolean;
  cartQuantity: number;
};

function ProductInfo({
  product,
  quantity,
  onQuantityIncrease,
  onQuantityDecrease,
  onQuantityChange,
  onAddToCart,
  isInCart,
  cartQuantity,
}: ProductInfoProps) {
  return (
    <div className='space-y-6'>
      <ProductBasicInfo product={product} />
      <ProductPricing product={product} />
      <ProductStock product={product} />
      <ProductDescription product={product} />
      <ProductMeta product={product} />
      <ProductActions
        product={product}
        quantity={quantity}
        onQuantityIncrease={onQuantityIncrease}
        onQuantityDecrease={onQuantityDecrease}
        onQuantityChange={onQuantityChange}
        onAddToCart={onAddToCart}
        isInCart={isInCart}
        cartQuantity={cartQuantity}
      />
    </div>
  );
}

type ProductBasicInfoProps = Pick<ProductDetailsProps, 'product'>;

function ProductBasicInfo({ product }: ProductBasicInfoProps) {
  return (
    <>
      <div>
        <span className='inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 capitalize'>
          {product.category}
        </span>
      </div>
      <h1 className='text-3xl font-bold text-gray-900'>{product.title}</h1>
      <ProductRating product={product} />
    </>
  );
}

type ProductRatingProps = Pick<ProductDetailsProps, 'product'>;

function ProductRating({ product }: ProductRatingProps) {
  return (
    <div className='flex items-center gap-2'>
      <div className='flex items-center'>
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${
              i < Math.floor(product.rating)
                ? 'text-yellow-400'
                : 'text-gray-300'
            }`}
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
          </svg>
        ))}
      </div>
      <span className='text-sm text-gray-600'>
        {product.rating.toFixed(1)} / 5.0
      </span>
    </div>
  );
}

type ProductPricingProps = Pick<ProductDetailsProps, 'product'>;

function ProductPricing({ product }: ProductPricingProps) {
  const discountedPrice = calculateDiscountedPrice(
    product.price,
    product.discountPercentage
  );
  const hasDiscount = product.discountPercentage > 0;

  return (
    <div className='space-y-2'>
      <div className='flex items-baseline gap-3'>
        <span className='text-3xl font-bold text-gray-900'>
          ${discountedPrice.toFixed(2)}
        </span>
        {hasDiscount && (
          <>
            <span className='text-lg text-gray-400 line-through'>
              ${product.price.toFixed(2)}
            </span>
            <span className='inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-sm font-semibold text-red-600'>
              -{product.discountPercentage.toFixed(0)}% 할인
            </span>
          </>
        )}
      </div>
    </div>
  );
}

type ProductStockProps = Pick<ProductDetailsProps, 'product'>;

function ProductStock({ product }: ProductStockProps) {
  return (
    <div className='flex items-center gap-2'>
      <span className='text-sm text-gray-600'>재고:</span>
      <span
        className={`text-sm font-medium ${
          product.stock > 10 ? 'text-green-600' : 'text-orange-600'
        }`}
      >
        {product.stock}개 남음
      </span>
    </div>
  );
}

type ProductDescriptionProps = Pick<ProductDetailsProps, 'product'>;

function ProductDescription({ product }: ProductDescriptionProps) {
  return (
    <div className='space-y-3'>
      <h3 className='text-lg font-semibold text-gray-900'>상품 상세 설명</h3>
      <p className='text-gray-700 leading-relaxed'>{product.description}</p>
    </div>
  );
}

type ProductMetaProps = Pick<ProductDetailsProps, 'product'>;

function ProductMeta({ product }: ProductMetaProps) {
  return (
    <div className='grid grid-cols-2 gap-4 text-sm'>
      <div>
        <span className='text-gray-600'>브랜드:</span>
        <span className='ml-2 font-medium'>{product.brand}</span>
      </div>
      <div>
        <span className='text-gray-600'>SKU:</span>
        <span className='ml-2 font-medium'>{product.sku}</span>
      </div>
      <div>
        <span className='text-gray-600'>배송정보:</span>
        <span className='ml-2'>{product.shippingInformation}</span>
      </div>
      <div>
        <span className='text-gray-600'>반품정책:</span>
        <span className='ml-2'>{product.returnPolicy}</span>
      </div>
    </div>
  );
}

type ProductActionsProps = Pick<ProductDetailsProps, 'product'> & {
  quantity: number;
  onQuantityIncrease: () => void;
  onQuantityDecrease: () => void;
  onQuantityChange: (value: string) => void;
  onAddToCart: () => void;
  isInCart: boolean;
  cartQuantity: number;
};

function ProductActions({
  product,
  quantity,
  onQuantityIncrease,
  onQuantityDecrease,
  onQuantityChange,
  onAddToCart,
  isInCart,
  cartQuantity,
}: ProductActionsProps) {
  const isAddToCartDisabled = product.stock === 0 || quantity <= 0;

  return (
    <div className='space-y-4'>
      {/* 장바구니 상태 표시 */}
      {isInCart && (
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <svg
                className='w-5 h-5 text-blue-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 13l4 4L19 7'
                />
              </svg>
              <span className='text-sm font-medium text-blue-800'>
                이미 장바구니에 있는 상품입니다
              </span>
            </div>
            <span className='text-sm text-blue-600'>현재 {cartQuantity}개</span>
          </div>
        </div>
      )}

      <div className='flex items-center gap-3'>
        <label className='text-sm font-medium text-gray-700'>수량:</label>
        <div className='flex items-center border border-gray-300 rounded-lg'>
          <Button
            variant='ghost'
            size='sm'
            onClick={onQuantityDecrease}
            disabled={quantity <= 1}
            className='h-9 w-9 p-0 rounded-none border-r border-gray-300'
          >
            -
          </Button>
          <Input
            type='number'
            value={quantity}
            onChange={(e) => onQuantityChange(e.target.value)}
            min={1}
            max={product.stock}
            className='h-9 w-16 text-center border-0 rounded-none focus-visible:ring-0 focus-visible:border-0'
          />
          <Button
            variant='ghost'
            size='sm'
            onClick={onQuantityIncrease}
            disabled={quantity >= product.stock}
            className='h-9 w-9 p-0 rounded-none border-l border-gray-300'
          >
            +
          </Button>
        </div>
        <span className='text-sm text-gray-500'>(최대 {product.stock}개)</span>
      </div>

      <Button
        className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300'
        size='lg'
        disabled={isAddToCartDisabled}
        onClick={onAddToCart}
      >
        {product.stock === 0
          ? '품절'
          : isInCart
            ? '장바구니에 더 추가'
            : '장바구니에 추가'}
      </Button>
    </div>
  );
}

type ProductReviewsProps = Pick<ProductDetailsProps, 'product'> & {
  sortType: ReviewSortType;
  onSortChange: (sortType: ReviewSortType) => void;
};

function ProductReviews({
  product,
  sortType,
  onSortChange,
}: ProductReviewsProps) {
  if (!product.reviews || product.reviews.length === 0) {
    return null;
  }

  const sortedReviews = [...product.reviews].sort((a, b) => {
    if (sortType === 'latest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return b.rating - a.rating;
    }
  });

  return (
    <div className='mt-12'>
      <ProductReviewsHeader
        sortType={sortType}
        onSortChange={onSortChange}
        reviewCount={product.reviews.length}
      />
      <ProductReviewsList reviews={sortedReviews} />
    </div>
  );
}

type ProductReviewsHeaderProps = {
  sortType: ReviewSortType;
  onSortChange: (sortType: ReviewSortType) => void;
  reviewCount: number;
};

function ProductReviewsHeader({
  sortType,
  onSortChange,
  reviewCount,
}: ProductReviewsHeaderProps) {
  return (
    <div className='flex items-center justify-between mb-6'>
      <h2 className='text-2xl font-bold text-gray-900'>
        고객 리뷰 ({reviewCount}개)
      </h2>
      <div className='flex gap-2'>
        <button
          onClick={() => onSortChange('latest')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            sortType === 'latest'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          최신순
        </button>
        <button
          onClick={() => onSortChange('rating')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            sortType === 'rating'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          평점순
        </button>
      </div>
    </div>
  );
}

type ProductReviewsListProps = {
  reviews: Product['reviews'];
};

function ProductReviewsList({ reviews }: ProductReviewsListProps) {
  return (
    <div className='space-y-6'>
      {reviews.map((review, index) => (
        <ProductReviewCard
          key={`${review.reviewerEmail}-${index}`}
          review={review}
        />
      ))}
    </div>
  );
}

type ProductReviewCardProps = {
  review: Product['reviews'][0];
};

function ProductReviewCard({ review }: ProductReviewCardProps) {
  return (
    <div className='bg-white border border-gray-200 rounded-lg p-6'>
      <div className='flex items-start justify-between mb-3'>
        <div>
          <h4 className='font-medium text-gray-900'>{review.reviewerName}</h4>
          <ProductReviewRating rating={review.rating} />
        </div>
        <span className='text-sm text-gray-500'>
          {new Date(review.date).toLocaleDateString('ko-KR')}
        </span>
      </div>
      <p className='text-gray-700'>{review.comment}</p>
    </div>
  );
}

type ProductReviewRatingProps = {
  rating: number;
};

function ProductReviewRating({ rating }: ProductReviewRatingProps) {
  return (
    <div className='flex items-center mt-1'>
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${
            i < rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          fill='currentColor'
          viewBox='0 0 20 20'
        >
          <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
        </svg>
      ))}
    </div>
  );
}
