import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import {
  useRemoveProductFromCartMutation,
  useUpdateProductQuantityMutation,
} from "../../api/cart/cartQueries";
import { TCartProduct, TProductSchema } from "../../types";

const CartItem = ({ product }: { product: TCartProduct }) => {
  const { title, id, casePrice } = TProductSchema.parse(product.Product);

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

  const incrementQuantity = () => {
    updateQuantity.mutate({
      productId: product.Product.id,
      cartId: product.cartId,
      quantity: product.quantity + 1,
    });
  };

  const decrementQuantity = () => {
    if (product.quantity > 1) {
      updateQuantity.mutate({
        productId: product.Product.id,
        cartId: product.cartId,
        quantity: product.quantity - 1,
      });
    }
  };

  return (
    <tr className="items-center align-middle p-6">
      <td className="text-center ">{title}</td>
      <td className="text-center">{id}</td>
      <td className="text-center">${casePrice.toFixed(2)}</td>
      <td className="flex justify-center p-4 items-center">
        <button
          onClick={decrementQuantity}
          className="btn btn-outline btn-sm"
          disabled={product.quantity < 2}
        >
          <FontAwesomeIcon icon={faMinus} />
        </button>
        <span className="mx-2">{product.quantity}</span>
        <button onClick={incrementQuantity} className="btn btn-outline btn-sm">
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </td>
      <td className="text-center">
        ${(casePrice * product.quantity).toFixed(2)}
      </td>
      <td className="text-center ">
        <button
          onClick={() =>
            removeItem.mutate({
              productId: +product.Product.id,
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
