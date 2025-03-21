import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ProductFilters, TProduct } from "../types";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "@tanstack/react-router";
import { useAuth } from "../providers/auth.provider";
import { useAddItemToCartMutation } from "../api/cart/cartQueries";
import { toast } from "react-toastify";

export const ProductCard = ({
  product,
  searchParams,
}: {
  product: TProduct;
  searchParams: ProductFilters;
}) => {
  const packageString = product.package.join("/");
  const unitpackageString = product.UnitProduct?.package.join("/");
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
    <div className="w-[320px] h-[520px] bg-base-100 shadow-lg shadow-secondary flex flex-col items-center justify-between rounded-sm hover:outline-1 hover:outline-secondary hover:shadow-xl">
      <figure>
        <Link
          to="/products/$productId"
          params={{ productId: product.id.toString() }}
          search={searchParams}
        >
          <img
            className="w-[300px] h-[300px] m-0 p-0 object-contain object-center"
            src={product.image}
            alt={`image for ${product.title}`}
          />
        </Link>
      </figure>
      <div className="card-body">
        <Link
          to="/products/$productId"
          params={{ productId: product.id.toString() }}
          search={searchParams}
          className="card-title flex flex-col items-start mt-0 pt-0"
        >
          {product.title}
          <div className="badge badge-accent "> SKU {product.sku}</div>
        </Link>

        {/* <p>{product.description}</p> */}
        <div className="card-actions justify-end">
          <div className="flex">
            <div className="w-full flex justify-center border-2">
              <div className="badge badge-secondary text-xs">
                Case: {packageString}
              </div>
              {product.UnitProduct && (
                <div className="badge badge-secondary">
                  Unit: {unitpackageString}
                </div>
              )}
            </div>
            <div className="badge badge-primary text-xl font-semibold p-2">
              Case: ${parseFloat(product.casePrice.toString()).toFixed(2)}
            </div>
          </div>

          {authState === "authenticated" ? (
            <div className="flex justify-around items-center gap-4">
              <button
                className="btn btn-secondary btn-outline"
                onClick={() =>
                  addItem.mutate({
                    productId: product.id,
                    cartId: userCartId!,
                    isUnit: false,
                  })
                }
              >
                Add Case <FontAwesomeIcon icon={faCartPlus} />
              </button>
              {product.UnitProduct && (
                <button
                  className="btn btn-secondary btn-outline"
                  onClick={() =>
                    addItem.mutate({
                      productId: product.id,
                      cartId: userCartId!,
                      isUnit: true,
                    })
                  }
                >
                  Add Unit <FontAwesomeIcon icon={faCartPlus} />
                </button>
              )}
            </div>
          ) : (
            <p>Please sign-in to add product to cart</p>
          )}
        </div>
      </div>
    </div>
  );
};
