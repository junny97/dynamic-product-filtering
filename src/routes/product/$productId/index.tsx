import { createFileRoute, redirect, Link } from '@tanstack/react-router';
import { z } from 'zod';
import { useState } from 'react';
import {
  createProductByIdQueryOptions,
  useProductByIdQuery,
} from '../../../features/products/use-products.query';
import { calculateDiscountedPrice } from '../../../utils/utliFn';
import type { Product } from '../../../features/products/products.type';

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

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className='max-w-7xl mx-auto p-4'>
      <ProductDetailHeader />
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <ProductImageGallery product={product} />
        <ProductInfo product={product} />
      </div>
      <ProductReviews product={product} />
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

type ProductImageGalleryProps = Pick<ProductDetailsProps, 'product'>;

function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className='space-y-4'>
      <ProductMainImage
        product={product}
        selectedImageIndex={selectedImageIndex}
      />
      <ProductThumbnails
        product={product}
        selectedImageIndex={selectedImageIndex}
        onImageSelect={setSelectedImageIndex}
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

type ProductInfoProps = Pick<ProductDetailsProps, 'product'>;

function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className='space-y-6'>
      <ProductBasicInfo product={product} />
      <ProductPricing product={product} />
      <ProductStock product={product} />
      <ProductDescription product={product} />
      <ProductMeta product={product} />
      <ProductActions product={product} />
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

type ProductActionsProps = Pick<ProductDetailsProps, 'product'>;

function ProductActions({ product }: ProductActionsProps) {
  return (
    <button
      className='w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed'
      disabled={product.stock === 0}
    >
      {product.stock === 0 ? '품절' : '장바구니에 추가'}
    </button>
  );
}

type ProductReviewsProps = Pick<ProductDetailsProps, 'product'>;

function ProductReviews({ product }: ProductReviewsProps) {
  if (!product.reviews || product.reviews.length === 0) {
    return null;
  }

  return (
    <div className='mt-12'>
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>고객 리뷰</h2>
      <div className='space-y-6'>
        {product.reviews.map((review, index) => (
          <ProductReviewCard key={index} review={review} />
        ))}
      </div>
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
