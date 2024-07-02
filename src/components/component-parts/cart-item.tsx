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

  return (
    <tr className=" w-full items-center align-middle p-6">
      <td className="text-center ">{title}</td>
      <td className="text-center">{sku}</td>
      <td className="text-center">${parseFloat(casePrice).toFixed(2)}</td>
      <td className="flex justify-center p-4 items-center">
        <button
          onClick={decrementCaseQuantity}
          className="btn btn-outline btn-sm"
          disabled={product.caseQuantity == 0}
        >
          <FontAwesomeIcon icon={faMinus} />
        </button>
        <span className="mx-2">{product.caseQuantity}</span>
        <button
          onClick={incrementCaseQuantity}
          className="btn btn-outline btn-sm"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </td>
      <td className="text-center">
        {" "}
        {!unitPrice ? "-" : `${unitPrice.toFixed(2)}`}
      </td>
      <td className="flex justify-center p-4 items-center">
        {!unitPrice ? (
          <> {"Not sold as unit"}</>
        ) : (
          <>
            <button
              onClick={decrementUnitQuantity}
              className="btn btn-outline btn-sm"
              disabled={product.unitQuantity == 0}
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>
            <span className="mx-2">{product.unitQuantity}</span>
            <button
              onClick={incrementUnitQuantity}
              className="btn btn-outline btn-sm"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </>
        )}
      </td>
      <td className="text-center">${subtotal.toFixed(2)}</td>
      <td className="text-center ">
        <button
          onClick={() =>
            removeItem.mutate({
              productId: product.Product.id,
              cartId: product.cartId,
            })
          }
          className="btn btn-error btn-outline"
        >
          <FontAwesomeIcon icon={faX} />
        </button>
      </td>
    </tr>
  );
};

export default CartItem;
