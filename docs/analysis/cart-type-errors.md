# Cart Domain Type Errors

## Summary
10 TypeScript errors found in cart-related files:
- **TAddress missing index signature** (3 errors in cart.tsx)
- **string | undefined not assignable to string** (2 errors in cart.tsx)
- **Unused variable 'index'** (1 error in cart.tsx)
- **TCartProduct[] | undefined not assignable to TCartProduct[]** (2 errors in profile routes)
- **Possibly undefined cart.cartProducts.length** (2 errors in profile routes)

## Errors Detail

### cart.tsx Errors

#### Error 1-3: TAddress Index Signature (Lines 109, 180, 200)
**File:** `src/components/cart.tsx`

**Lines:**
- Line 109: `if (currentShippingAddress && !isObjectEmpty(currentShippingAddress))`
- Line 180: `isObjectEmpty(shippingAddress) ? undefined : shippingAddress`
- Line 200: `currentShippingAddress && !isObjectEmpty(currentShippingAddress)`

**Issue:** `TAddress` type doesn't satisfy `Record<string, unknown>` required by `isObjectEmpty()` function

**Root Cause:**
The `isObjectEmpty()` function in `src/utils/validationUtils.ts` expects `Record<string, unknown>` but `TAddress` is defined as:
```typescript
export interface TAddress {
  id: string;
  street1: string;
  street2?: string | null;
  city: string;
  state: keyof typeof States;
  postalCode: string;
}
```

This interface doesn't have an index signature to satisfy `Record<string, unknown>`.

**Fix Options:**
1. Add type assertion when calling `isObjectEmpty(address as Record<string, unknown>)`
2. Add index signature to `TAddress` type
3. Make `isObjectEmpty()` generic to accept any object type

#### Error 4-5: String | Undefined Assignment (Lines 192, 491)
**File:** `src/components/cart.tsx`

**Lines:**
- Line 192: `body: { userId: user?.userInfo?.profile?.userId, acceptedTerms: true }`
- Line 491: `cartId={user?.userInfo?.cart?.id}` (passed to HelcimPayButton)
- Line 501: `shippingAddressId: { isShippingAddressSet ? currentShippingAddress?.id : "" }`

**Issue:** Optional chaining `user?.userInfo?.profile?.userId` and `user?.userInfo?.cart?.id` returns `string | undefined` but the receiving functions/components expect `string`

**Root Cause:**
The user object has deeply nested optional properties that may be undefined, but no null checks are performed before passing to components.

**Fix Options:**
1. Add null coalescing operator: `user?.userInfo?.cart?.id ?? ""`
2. Add type guards to check for undefined before passing
3. Update component props to accept `string | undefined`

#### Error 6: Unused Variable (Line 242)
**File:** `src/components/cart.tsx`

**Line:** `{products.map((product, index) => (`

**Issue:** The `index` parameter is declared but never used in the map callback

**Fix Options:**
1. Remove the `index` parameter: `products.map((product) => ...)`
2. Use it as a key if needed (though `product.productId` is already used)

### Profile Routes Errors

#### Error 7: TCartProduct[] | undefined Assignment (Line 28)
**File:** `src/routes/_auth/profile/cart/$cartId/index.tsx`

**Line:** `products={products?.cartProducts}`

**Issue:** The `Cart` component expects `products: TCartProduct[]` but `products?.cartProducts` is `TCartProduct[] | undefined`

**Root Cause:**
Cart component props definition at line 38 of cart.tsx:
```typescript
products: TCartProduct[];
```
But the data from useQuery may have undefined cartProducts.

**Fix Options:**
1. Provide fallback: `products={products?.cartProducts ?? []}`
2. Update Cart component to accept `products?: TCartProduct[]`
3. Add loading/error state before rendering Cart

#### Error 8-9: Possibly Undefined Length (Lines 102, 129)
**File:** `src/routes/_auth/profile/index.tsx`

**Lines:**
- Line 102: `{cart?.cartProducts.length > 0 && (`
- Line 129: `{cart?.cartProducts.length > 0 && (`

**Issue:** Using optional chaining on `cart` but then accessing `.cartProducts.length` without checking if `cartProducts` exists

**Root Cause:**
`cart.cartProducts` may be undefined even when `cart` exists, but the code only checks for `cart` with optional chaining.

**Fix Options:**
1. Use full optional chaining: `{cart?.cartProducts?.length > 0 && (`
2. Add explicit check: `{cart && cart.cartProducts && cart.cartProducts.length > 0 && (`

#### Error 10: TCartProduct[] | undefined Assignment (Line 117)
**File:** `src/routes/_auth/profile/index.tsx`

**Line:** `products={cart?.cartProducts}`

**Issue:** Same as Error 7 - Cart component expects `TCartProduct[]` but receives `TCartProduct[] | undefined`

**Fix:** Same options as Error 7

## Type Definitions

### TAddress (src/types.ts:251)
```typescript
export interface TAddress {
  id: string;
  street1: string;
  street2?: string | null;
  city: string;
  state: keyof typeof States;
  postalCode: string;
}
```

### Cart Component Props (src/components/cart.tsx:34-40)
```typescript
const Cart = ({
  products,
  shippingAddress,
}: {
  products: TCartProduct[];
  shippingAddress: TAddress;
}) => {
```

### isObjectEmpty Function (src/utils/validationUtils.ts:58)
```typescript
export function isObjectEmpty(obj: Record<string, unknown>) {
  for (const key in obj) {
    if (Object.hasOwn(obj, key) && obj[key] !== "") {
      return false;
    }
  }
  return true;
}
```

## Priority: CRITICAL

**Impact:** Direct impact on checkout flow and revenue. Cart functionality is core to e-commerce operations.

**User Experience Impact:**
- Users may not be able to complete checkout
- Cart may not display properly
- Shipping address validation may fail
- Payment button may not work correctly

## Recommended Fix Order

1. **Fix Cart component props** (Errors 7, 10) - Make products optional with default
2. **Fix optional chaining** (Errors 8, 9) - Add proper null checks
3. **Fix TAddress index signature** (Errors 1-3) - Type assertions or generic function
4. **Fix string | undefined** (Errors 4, 5) - Add null coalescing
5. **Remove unused variable** (Error 6) - Clean up

## Next Steps

1. Write tests for Cart component with undefined/null values
2. Implement fixes following test-driven development
3. Verify all cart flows work after fixes
4. Deploy and monitor with Sentry
