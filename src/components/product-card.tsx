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
  const unitPackageString = product.UnitProduct?.package.join("/");
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
    <div className="w-[320px] gap-3 p-4 bg-base-100 shadow-md shadow-secondary flex flex-col items-center justify-between rounded-sm hover:outline-1 hover:outline-secondary hover:shadow-xl">
      <figure>
        <div className="badge badge-accent my-2">SKU: {product.sku}</div>
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
          className="flex flex-col items-start mt-0 pt-0"
        >
          <span className="card-title text-xl font-bold underline overflow-scroll whitespace-nowrap">
            {product.title}
          </span>{" "}
        </Link>

        <div className="card-actions justify-end">
          <div className="flex w-full gap-4 items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-4 h-[160px]">
              <div className="badge badge-secondary text-xs p-3">
                Case: {packageString}
              </div>
              <div className="badge badge-primary text-xl font-semibold p-3">
                ${parseFloat(product.casePrice.toString()).toFixed(2)}
              </div>
              {authState === "authenticated" ? (
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
              ) : (
                <p>Please sign-in to add product to cart</p>
              )}
            </div>
            {product.UnitProduct && (
              <>
                <div className="flex flex-col items-center justify-center gap-4 h-[160px] ">
                  <div className="badge badge-secondary text-xs p-3">
                    Unit: {unitPackageString}
                  </div>

                  <div className="badge badge-primary text-xl font-semibold p-2">
                    ${parseFloat(product.UnitProduct.unitPrice).toFixed(2)}
                  </div>

                  {authState === "authenticated" ? (
                    <div className="flex justify-around items-center gap-4">
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
                    </div>
                  ) : (
                    <p>Please sign-in to add product to cart</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
