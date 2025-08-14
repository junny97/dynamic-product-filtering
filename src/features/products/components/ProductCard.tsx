import { calculateDiscountedPrice } from '../../../utils/utliFn';
import type { Product } from '../products.type';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const discountedPrice = calculateDiscountedPrice(
    product.price,
    product.discountPercentage
  );
  const hasDiscount = product.discountPercentage > 0;

  return (
    <div className='rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden'>
      <div className='relative p-4'>
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

        <div className='flex items-center justify-center'>
          <img
            src={product.thumbnail || product.images?.[0]}
            alt={product.title}
            className='h-44 object-contain'
            loading='lazy'
          />
        </div>
      </div>

      <div className='space-y-2 border-t border-slate-100 bg-slate-50 p-4'>
        <h3 className='text-base font-semibold text-slate-900 line-clamp-1'>
          {product.title}
        </h3>
        <p className='text-sm text-slate-600 line-clamp-2'>
          {product.description}
        </p>

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

        <div className='mt-1 flex items-center justify-between text-xs text-slate-500'>
          <span>⭐ {product.rating.toFixed(2)}</span>
          <span>Stock: {product.stock}</span>
        </div>
      </div>
    </div>
  );
}
