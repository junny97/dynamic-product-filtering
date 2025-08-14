import { Link } from '@tanstack/react-router';
import { calculateDiscountedPrice } from '../../../utils/utliFn';
import type { Product } from '../products.type';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to='/product/$productId'
      params={{ productId: product.id }}
      className='block rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden hover:shadow-md transition-shadow'
    >
      <ProductCardImage product={product} />
      <ProductCardInfo product={product} />
    </Link>
  );
}

type ProductCardImageProps = Pick<ProductCardProps, 'product'>;

function ProductCardImage({ product }: ProductCardImageProps) {
  return (
    <div className='relative p-4'>
      <ProductCardBadges product={product} />
      <div className='flex items-center justify-center'>
        <img
          src={product.thumbnail || product.images?.[0]}
          alt={product.title}
          className='h-44 object-contain'
          loading='lazy'
        />
      </div>
    </div>
  );
}

type ProductCardBadgesProps = Pick<ProductCardProps, 'product'>;

function ProductCardBadges({ product }: ProductCardBadgesProps) {
  const hasDiscount = product.discountPercentage > 0;

  return (
    <>
      <div className='absolute left-3 top-3'>
        <span className='inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 capitalize'>
          {product.category}
        </span>
      </div>
      {hasDiscount && (
        <div className='absolute right-3 top-3'>
          <span className='inline-flex items-center rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600'>
            -{product.discountPercentage}%
          </span>
        </div>
      )}
    </>
  );
}

type ProductCardInfoProps = Pick<ProductCardProps, 'product'>;

function ProductCardInfo({ product }: ProductCardInfoProps) {
  return (
    <div className='space-y-2 border-t border-slate-100 bg-slate-50 p-4'>
      <ProductCardContent product={product} />
      <ProductCardPricing product={product} />
      <ProductCardMeta product={product} />
    </div>
  );
}

type ProductCardContentProps = Pick<ProductCardProps, 'product'>;

function ProductCardContent({ product }: ProductCardContentProps) {
  return (
    <>
      <h3 className='text-base font-semibold text-slate-900 line-clamp-1'>
        {product.title}
      </h3>
      <p className='text-sm text-slate-600 line-clamp-2'>
        {product.description}
      </p>
    </>
  );
}

type ProductCardPricingProps = Pick<ProductCardProps, 'product'>;

function ProductCardPricing({ product }: ProductCardPricingProps) {
  const discountedPrice = calculateDiscountedPrice(
    product.price,
    product.discountPercentage
  );
  const hasDiscount = product.discountPercentage > 0;

  return (
    <div className='mt-2 flex items-baseline gap-3'>
      <span className='text-xl font-extrabold text-slate-900'>
        ${discountedPrice.toFixed(2)}
      </span>
      {hasDiscount && (
        <span className='text-sm text-slate-400 line-through'>
          ${product.price.toFixed(2)}
        </span>
      )}
    </div>
  );
}

type ProductCardMetaProps = Pick<ProductCardProps, 'product'>;

function ProductCardMeta({ product }: ProductCardMetaProps) {
  return (
    <div className='mt-1 flex items-center justify-between text-xs text-slate-500'>
      <span>⭐ {product.rating.toFixed(2)}</span>
      <span>Stock: {product.stock}</span>
    </div>
  );
}
