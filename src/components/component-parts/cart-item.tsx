import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import {
  useRemoveProductFromCartMutation,
  useUpdateProductQuantityMutation,
} from "../../api/cart/cartQueries";
import { TCartProduct, TProductSchema } from "../../types";

const CartItem = ({ product }: { product: TCartProduct }) => {
  const { title, sku, casePrice, UnitProduct } = TProductSchema.parse(
    product.Product
  );
  const unitPrice = UnitProduct ? parseFloat(UnitProduct.unitPrice) : 0;

  const caseQuantity = product.caseQuantity || 0;
  const unitQuantity = product.unitQuantity || 0;

  const subtotal =
    parseFloat(casePrice) * caseQuantity + unitPrice * unitQuantity;

  const removeItem = useRemoveProductFromCartMutation(
    product.cartId,
    () => {
      toast.success(`Removed ${product.Product.title} from cart`, {
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
      toast.success(`Updated quantity for ${product.Product.title}`, {
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
      productId: product.Product.id,
      cartId: product.cartId,
      quantity: product.caseQuantity + 1,
      isUnit: false,
    });
  };

  const decrementCaseQuantity = () => {
    if (product.caseQuantity > 0) {
      updateQuantity.mutate({
        productId: product.Product.id,
        cartId: product.cartId,
        quantity: product.caseQuantity - 1,
        isUnit: false,
      });
    }
  };

  const incrementUnitQuantity = () => {
    updateQuantity.mutate({
      productId: product.Product.id,
      cartId: product.cartId,
      quantity: product.unitQuantity + 1,
      isUnit: true,
    });
  };

  const decrementUnitQuantity = () => {
    if (product.unitQuantity > 0) {
      updateQuantity.mutate({
        productId: product.Product.id,
        cartId: product.cartId,
        quantity: product.unitQuantity - 1,
        isUnit: true,
      });
    }
  };

  const QuantityControl = ({
    quantity,
    onIncrement,
    onDecrement,
    isDisabled = false,
  }: {
    quantity: number;
    onIncrement: () => void;
    onDecrement: () => void;
    isDisabled: boolean;
  }) => (
    <div className="flex flex-col-reverse items-center justify-center gap-2 md:flex-row">
      <button
        onClick={onDecrement}
        className="btn btn-outline btn-xs md:btn-sm md:w-auto w-full h-6"
        disabled={isDisabled}
      >
        <FontAwesomeIcon icon={faMinus} />
      </button>
      <span className="my-1 md:my-0">{quantity}</span>
      <button
        onClick={onIncrement}
        className="btn btn-outline btn-xs md:btn-sm md:w-auto w-full h-6"
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );

  return (
    <tr className="w-full align-middle border-b">
      <td className="text-center py-2">
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-base-content md:hidden mt-1">
          SKU: {sku}
        </div>
      </td>
      <td className="hidden md:table-cell text-center">{sku}</td>
      <td className="hidden md:table-cell text-center">
        ${parseFloat(casePrice).toFixed(2)}
      </td>
      <td className="text-center">
        <div className="text-sm text-base-content md:hidden mt-1">
          Case: ${parseFloat(casePrice).toFixed(2)}
        </div>
        <QuantityControl
          quantity={product.caseQuantity}
          onIncrement={incrementCaseQuantity}
          onDecrement={decrementCaseQuantity}
          isDisabled={product.caseQuantity === 0}
        />
      </td>
      <td className="hidden md:table-cell text-center">
        {!unitPrice ? "-" : `$${unitPrice.toFixed(2)}`}
      </td>
      <td className="text-center">
        {!unitPrice ? (
          <span className="text-sm">Not sold as unit</span>
        ) : (
          <div>
            <div className="text-sm text-base-content md:hidden mt-1">
              Unit: ${unitPrice.toFixed(2)}
            </div>
            <QuantityControl
              quantity={product.unitQuantity}
              onIncrement={incrementUnitQuantity}
              onDecrement={decrementUnitQuantity}
              isDisabled={product.unitQuantity === 0}
            />
          </div>
        )}
      </td>
      <td className="text-right md:text-center font-semibold">
        ${subtotal.toFixed(2)}
        <div className="text-sm text-base-content md:hidden mt-1">Subtotal</div>
      </td>
      <td className="text-center">
        <button
          onClick={() =>
            removeItem.mutate({
              productId: product.Product.id,
              cartId: product.cartId,
            })
          }
          className="btn btn-error btn-outline btn-sm"
        >
          <FontAwesomeIcon icon={faX} />
        </button>
      </td>
    </tr>
  );
};

export default CartItem;
