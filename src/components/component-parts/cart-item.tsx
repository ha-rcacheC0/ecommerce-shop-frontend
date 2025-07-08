import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPlus,
  faMinus,
  faTheaterMasks,
  faBox,
  faBoxes,
  faShirt, // For apparel items
} from "@fortawesome/free-solid-svg-icons";
import {
  useRemoveProductFromCartMutation,
  useUpdateProductQuantityMutation,
} from "../../api/cart/cartQueries";
import { TCartProduct } from "../../types";

const CartItem = ({ product }: { product: TCartProduct }) => {
  const { title, sku, casePrice, unitProduct, isShow, isApparel } =
    product.product;

  // Handle variant information
  const variant = product.product.variants?.find(
    (z) => z.id === product.variantId
  );

  const unitPrice = variant
    ? parseFloat(variant.unitPrice)
    : unitProduct
      ? parseFloat(unitProduct.unitPrice)
      : 0;

  const caseQuantity = product.caseQuantity || 0;
  const unitQuantity = product.unitQuantity || 0;

  const subtotal =
    parseFloat(casePrice) * caseQuantity + unitPrice * unitQuantity;

  // Gender display mapping
  const genderDisplay = {
    MALE: "Men's",
    FEMALE: "Women's",
    UNISEX: "Unisex",
  };

  const removeItem = useRemoveProductFromCartMutation(
    product.cartId,
    () => {
      toast.success(`Removed ${product.product.title} from cart`, {
        position: "bottom-right",
      });
    },
    () => {
      toast.error("Unable to remove product from cart", {
        position: "bottom-right",
      });
    }
  );

  const updateQuantity = useUpdateProductQuantityMutation(
    product.cartId,
    () => {
      toast.success(`Updated quantity for ${product.product.title}`, {
        position: "bottom-right",
      });
    },
    () => {
      toast.error("Unable to update quantity", {
        position: "bottom-right",
      });
    }
  );

  const incrementCaseQuantity = () => {
    updateQuantity.mutate({
      productId: product.product.id,
      cartId: product.cartId,
      quantity: product.caseQuantity + 1,
      isUnit: false,
      variantId: variant?.id || "",
    });
  };

  const decrementCaseQuantity = () => {
    if (product.caseQuantity > 0) {
      updateQuantity.mutate({
        productId: product.product.id,
        cartId: product.cartId,
        quantity: product.caseQuantity - 1,
        isUnit: false,
        variantId: variant?.id || "",
      });
    }
  };

  const incrementUnitQuantity = () => {
    updateQuantity.mutate({
      productId: product.product.id,
      cartId: product.cartId,
      quantity: product.unitQuantity + 1,
      isUnit: true,
      variantId: variant?.id || "",
    });
  };

  const decrementUnitQuantity = () => {
    if (product.unitQuantity > 0) {
      updateQuantity.mutate({
        productId: product.product.id,
        cartId: product.cartId,
        quantity: product.unitQuantity - 1,
        isUnit: true,
        variantId: variant?.id || "",
      });
    }
  };

  const QuantityControl = ({
    label,
    price,
    quantity,
    onDecrement,
    onIncrement,
    icon,
  }: {
    label: string;
    price: number;
    quantity: number;
    onDecrement: () => void;
    onIncrement: () => void;
    icon?: React.ReactNode;
  }) => (
    <div className="flex items-center mb-2 gap-2 justify-around w-full">
      <div className="w-1/2 flex justify-center gap-4">
        <div className="badge badge-primary mr-2">
          {icon && <span className="mr-1">{icon}</span>}
          {label}
        </div>
        <div className="text-md text-center font-medium">
          ${price.toFixed(2)}
        </div>
      </div>

      <div className="flex items-center">
        <button
          onClick={onDecrement}
          className="btn btn-sm btn-primary btn-circle btn-ghost"
          disabled={quantity < 1}
        >
          <FontAwesomeIcon icon={faMinus} size="sm" />
        </button>
        <span className="w-8 text-center">{quantity}</span>
        <button
          onClick={onIncrement}
          className="btn btn-sm btn-primary btn-circle btn-ghost"
        >
          <FontAwesomeIcon icon={faPlus} size="sm" />
        </button>
      </div>
    </div>
  );

  return (
    <tr className="border-b border-base-300 hover:bg-base-200/40">
      {/* Product column */}
      <td className="py-4">
        <div className="flex items-center justify-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle w-12 h-12">
              <img
                src={product.product.image}
                alt={title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.png";
                }}
              />
            </div>
          </div>
          <div>
            <div className="font-medium text-center truncate max-w-[120px] md:max-w-[200px]">
              {title}
            </div>

            {/* Special badges for different product types */}
            {isShow && (
              <div className="badge badge-secondary badge-sm">Show Package</div>
            )}
            {isApparel && (
              <div className="badge badge-accent badge-sm">Apparel</div>
            )}

            {/* Apparel variant information */}
            {isApparel && variant && (
              <div className="mt-1 text-xs text-gray-600 space-y-1">
                <div className="flex flex-wrap gap-1">
                  <span className="badge badge-outline badge-xs">
                    {variant.size}
                  </span>
                  <span className="badge badge-outline badge-xs">
                    {genderDisplay[variant.gender]}
                  </span>
                  {variant.color && (
                    <span className="badge badge-outline badge-xs">
                      {variant.color.name}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </td>

      {/* SKU column */}
      <td className="py-4 text-center">
        <div className="font-mono text-sm">
          {/* Show variant SKU if apparel, otherwise product SKU */}
          {isApparel && variant ? variant.sku : sku}
        </div>
        {/* Show base product SKU for apparel items below variant SKU */}
        {isApparel && variant && variant.sku !== sku && (
          <div className="text-xs text-gray-500 font-mono">Base: {sku}</div>
        )}
      </td>

      <td className="py-4 px-2">
        <div className="flex flex-col">
          {/* Special display for shows */}
          {isShow ? (
            <QuantityControl
              key={`Show-${product.id}`}
              label="Show"
              icon={<FontAwesomeIcon icon={faTheaterMasks} />}
              price={parseFloat(casePrice)}
              quantity={caseQuantity}
              onDecrement={decrementCaseQuantity}
              onIncrement={incrementCaseQuantity}
            />
          ) : isApparel ? (
            /* Special display for apparel - typically unit sales only */
            <>
              <QuantityControl
                key={`Apparel-${product.id}`}
                label={`Apparel`}
                icon={<FontAwesomeIcon icon={faShirt} />}
                price={unitPrice}
                quantity={unitQuantity}
                onDecrement={decrementUnitQuantity}
                onIncrement={incrementUnitQuantity}
              />
            </>
          ) : (
            /* Regular products */
            <>
              <QuantityControl
                key={`Cases-${product.id}`}
                label="Case"
                icon={<FontAwesomeIcon icon={faBoxes} />}
                price={parseFloat(casePrice)}
                quantity={caseQuantity}
                onDecrement={decrementCaseQuantity}
                onIncrement={incrementCaseQuantity}
              />

              {unitPrice > 0 && (
                <QuantityControl
                  key={`Units-${product.id}`}
                  label="Unit"
                  icon={<FontAwesomeIcon icon={faBox} />}
                  price={unitPrice}
                  quantity={unitQuantity}
                  onDecrement={decrementUnitQuantity}
                  onIncrement={incrementUnitQuantity}
                />
              )}
            </>
          )}
        </div>
      </td>

      {/* Subtotal column */}
      <td className="py-4 text-center font-medium">${subtotal.toFixed(2)}</td>

      {/* Remove column */}
      <td className="py-4 text-center">
        <button
          onClick={() =>
            removeItem.mutate({
              productId: product.product.id,
              cartId: product.cartId,
              variantId: variant?.id || "", // Include variant ID for removal
            })
          }
          className="btn btn-ghost btn-md btn-error"
          aria-label="Remove item"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </td>
    </tr>
  );
};

export default CartItem;
