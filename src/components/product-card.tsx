import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TProduct } from "../types";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "@tanstack/react-router";
import { useAuth } from "../providers/auth.provider";
import { useAddItemToCartMutation } from "../api/cart/cartQueries";
import { toast } from "react-toastify";

export const ProductCard = ({ product }: { product: TProduct }) => {
  const packageString = product.package.join(", ");
  const { authState, user } = useAuth();
  const userCartId = user?.userInfo?.Cart.id;
  const addItem = useAddItemToCartMutation(
    userCartId!,
    () => {
      toast.success(`${product.title} added to cart!`, {
        position: "bottom-right",
      });
    },
    () => {
      toast.error("Failed to add product to cart", {
        position: "bottom-right",
      });
    }
  );
  return (
    <div className="card  w-96 bg-base-100 shadow-xl max-h-96">
      <figure>
        <Link
          to={"/products/$productId"}
          params={{ productId: product.id.toString() }}
        >
          <img src={product.image} alt={`image for ${product.title}`} />
        </Link>
      </figure>
      <div className="card-body">
        <Link
          to={"/products/$productId"}
          params={{ productId: product.id.toString() }}
          className="card-title"
        >
          {product.title}
          <div className="badge badge-secondary">{product.casePrice}</div>
        </Link>
        <p>{product.description}</p>
        <div className="card-actions justify-end">
          <div className="mr-auto flex flex-col gap-3">
            <div className="badge badge-accent "> SKU {product.id}</div>
            <div className="badge badge-accent mr-auto">
              Packaged: {packageString}
            </div>
          </div>
          {authState === "authenticated" ? (
            <button
              className="btn btn-primary"
              onClick={() =>
                addItem.mutate({
                  productId: +product.id,
                  cartId: userCartId!,
                })
              }
            >
              Add To Cart <FontAwesomeIcon icon={faCartPlus} />
            </button>
          ) : (
            <p> Sign In to add product to cart</p>
          )}
        </div>
      </div>
    </div>
  );
};
