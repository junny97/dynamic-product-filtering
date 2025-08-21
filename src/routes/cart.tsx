import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useCartStore } from '../features/products/product.store';
import { calculateDiscountedPrice } from '../utils/utliFn';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import type { CartItem } from '../features/products/product.store';
import { useShallow } from 'zustand/react/shallow';

export const Route = createFileRoute('/cart')({
  component: CartPage,
});

function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCartStore(
    useShallow((state) => ({
      items: state.items,
      removeFromCart: state.removeFromCart,
      updateQuantity: state.updateQuantity,
      clearCart: state.clearCart,
      getTotalPrice: state.getTotalPrice,
      getTotalItems: state.getTotalItems,
    }))
  );

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className='max-w-7xl mx-auto p-4'>
      <CartHeader totalItems={getTotalItems()} onClearCart={clearCart} />
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2'>
          <CartItemsList
            items={items}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
          />
        </div>
        <div className='lg:col-span-1'>
          <CartSummary totalPrice={getTotalPrice()} />
        </div>
      </div>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className='max-w-2xl mx-auto p-8 text-center'>
      <div className='bg-gray-50 rounded-2xl p-12'>
        <svg
          className='w-24 h-24 mx-auto text-gray-300 mb-6'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1.5}
            d='M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a1 1 0 001 1h1M9 19a1 1 0 002 0m0 0a1 1 0 002 0m-2 0h2m-2 0v-2m0 0V9a1 1 0 012 0v8'
          />
        </svg>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>
          장바구니가 비어있습니다
        </h1>
        <p className='text-gray-600 mb-8'>
          원하는 상품을 장바구니에 담아보세요!
        </p>
        <Link to='/'>
          <Button size='lg' className='px-8'>
            쇼핑하러 가기
          </Button>
        </Link>
      </div>
    </div>
  );
}

type CartHeaderProps = {
  totalItems: number;
  onClearCart: () => void;
};

function CartHeader({ totalItems, onClearCart }: CartHeaderProps) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearCart = () => {
    if (showClearConfirm) {
      onClearCart();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 3000); // 3초 후 자동 취소
    }
  };

  return (
    <div className='mb-8'>
      <div className='flex items-center justify-between mb-4'>
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
          계속 쇼핑하기
        </Link>
        <Button
          variant='outline'
          onClick={handleClearCart}
          className={
            showClearConfirm ? 'bg-red-50 border-red-300 text-red-700' : ''
          }
        >
          {showClearConfirm ? '정말 모두 삭제하시겠습니까?' : '장바구니 비우기'}
        </Button>
      </div>
      <h1 className='text-3xl font-bold text-gray-900'>
        장바구니 ({totalItems}개)
      </h1>
    </div>
  );
}

type CartItemsListProps = {
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
};

function CartItemsList({
  items,
  onUpdateQuantity,
  onRemoveItem,
}: CartItemsListProps) {
  return (
    <div className='space-y-4'>
      {items.map((item) => (
        <CartItemCard
          key={item.product.id}
          item={item}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </div>
  );
}

type CartItemCardProps = {
  item: CartItem;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
};

function CartItemCard({
  item,
  onUpdateQuantity,
  onRemoveItem,
}: CartItemCardProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const { product } = item;

  const discountedPrice = calculateDiscountedPrice(
    product.price,
    product.discountPercentage
  );
  const totalPrice = discountedPrice * quantity;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      onRemoveItem(product.id);
      return;
    }
    if (newQuantity > product.stock) {
      newQuantity = product.stock;
    }
    setQuantity(newQuantity);
    onUpdateQuantity(product.id, newQuantity);
  };

  const handleQuantityInputChange = (value: string) => {
    const numValue = parseInt(value);
    if (isNaN(numValue)) return;
    handleQuantityChange(numValue);
  };

  return (
    <div className='bg-white border border-gray-200 rounded-lg p-6 shadow-sm'>
      <div className='flex gap-6'>
        {/* 상품 이미지 */}
        <div className='flex-shrink-0'>
          <Link to='/product/$productId' params={{ productId: product.id }}>
            <img
              src={product.thumbnail}
              alt={product.title}
              className='w-24 h-24 object-contain rounded-lg bg-gray-50 p-2 hover:shadow-md transition-shadow'
            />
          </Link>
        </div>

        {/* 상품 정보 */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-start justify-between'>
            <div className='flex-1'>
              <Link to='/product/$productId' params={{ productId: product.id }}>
                <h3 className='text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2'>
                  {product.title}
                </h3>
              </Link>
              <p className='text-sm text-gray-600 mt-1 capitalize'>
                {product.category} • {product.brand}
              </p>

              {/* 가격 정보 */}
              <div className='mt-2'>
                <div className='flex items-baseline gap-3'>
                  <span className='text-xl font-bold text-gray-900'>
                    ${discountedPrice.toFixed(2)}
                  </span>
                  {product.discountPercentage > 0 && (
                    <>
                      <span className='text-sm text-gray-400 line-through'>
                        ${product.price.toFixed(2)}
                      </span>
                      <span className='text-sm font-medium text-red-600'>
                        -{product.discountPercentage.toFixed(0)}% 할인
                      </span>
                    </>
                  )}
                </div>
                <div className='text-lg font-semibold text-blue-600 mt-1'>
                  소계: ${totalPrice.toFixed(2)}
                </div>
              </div>
            </div>

            {/* 삭제 버튼 */}
            <Button
              variant='ghost'
              size='sm'
              onClick={() => onRemoveItem(product.id)}
              className='text-red-500 hover:text-red-700 hover:bg-red-50'
            >
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                />
              </svg>
            </Button>
          </div>

          {/* 수량 조절 */}
          <div className='flex items-center gap-3 mt-4'>
            <label className='text-sm font-medium text-gray-700'>수량:</label>
            <div className='flex items-center border border-gray-300 rounded-lg'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className='h-9 w-9 p-0 rounded-none border-r border-gray-300'
              >
                -
              </Button>
              <Input
                type='number'
                value={quantity}
                onChange={(e) => handleQuantityInputChange(e.target.value)}
                min={1}
                max={product.stock}
                className='h-9 w-16 text-center border-0 rounded-none focus-visible:ring-0 focus-visible:border-0'
              />
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= product.stock}
                className='h-9 w-9 p-0 rounded-none border-l border-gray-300'
              >
                +
              </Button>
            </div>
            <span className='text-sm text-gray-500'>
              (재고: {product.stock}개)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

type CartSummaryProps = {
  totalPrice: number;
};

function CartSummary({ totalPrice }: CartSummaryProps) {
  const shippingFee = totalPrice > 30 ? 0 : 5.99; // $30 이상 무료배송
  const finalTotal = totalPrice + shippingFee;

  return (
    <div className='bg-gray-50 rounded-lg p-6 sticky top-4'>
      <h2 className='text-lg font-semibold text-gray-900 mb-4'>주문 요약</h2>

      <div className='space-y-3'>
        <div className='flex justify-between'>
          <span className='text-gray-600'>상품 총액</span>
          <span className='font-medium'>${totalPrice.toFixed(2)}</span>
        </div>

        <div className='flex justify-between'>
          <span className='text-gray-600'>배송비</span>
          <span className='font-medium'>
            {shippingFee === 0 ? (
              <span className='text-green-600'>무료</span>
            ) : (
              `$${shippingFee.toFixed(2)}`
            )}
          </span>
        </div>

        {totalPrice < 30 && (
          <div className='text-sm text-gray-500 bg-blue-50 p-3 rounded-lg'>
            ${(30 - totalPrice).toFixed(2)} 더 주문하시면 무료배송!
          </div>
        )}

        <hr className='border-gray-300' />

        <div className='flex justify-between text-lg font-bold'>
          <span>총 결제금액</span>
          <span className='text-blue-600'>${finalTotal.toFixed(2)}</span>
        </div>
      </div>

      <Button className='w-full mt-6' size='lg'>
        주문하기
      </Button>

      <div className='text-center mt-4'>
        <Link to='/' className='text-sm text-blue-600 hover:underline'>
          계속 쇼핑하기
        </Link>
      </div>
    </div>
  );
}
