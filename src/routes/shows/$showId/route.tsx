import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getShowByIdQueryOptions } from "@api/shows/showsQueries";
import { useAuth } from "@providers/auth.provider";
import { useAddItemToCartMutation } from "@api/cart/cartQueries";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartPlus,
  faArrowLeft,
  faBox,
  faBoxes,
} from "@fortawesome/free-solid-svg-icons";
import { ShowProduct } from "@/types";

export const Route = createFileRoute("/shows/$showId")({
  component: ShowDetailPage,
  loader: ({ context: { queryClient }, params: { showId } }) => {
    queryClient.ensureQueryData(getShowByIdQueryOptions(showId));
  },
});

function ShowDetailPage() {
  const { showId } = Route.useParams();
  const { authState, user } = useAuth();

  const { data: show, isLoading } = useQuery(getShowByIdQueryOptions(showId));

  const userCartId = user?.userInfo?.cart!.id;

  const addToCart = useAddItemToCartMutation(
    userCartId!,
    () => {
      toast.success(`${show?.title} added to cart!`, {
        position: "bottom-right",
      });
    },
    (error) => {
      toast.error(`Failed to add show to cart: ${error.message}`, {
        position: "bottom-right",
      });
    }
  );

  // Function to handle adding the entire show to cart
  const handleAddShowToCart = () => {
    if (!show || !userCartId) return;

    addToCart.mutate({
      productId: showId,
      cartId: userCartId,
      isUnit: false,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8 min-h-[60vh]">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4">Loading show details...</p>
        </div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-base-100 rounded-lg shadow-xl p-6">
          <h1 className="text-2xl font-bold mb-4">Show not found</h1>
          <Link to="/shows" className="btn btn-primary">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Shows
          </Link>
        </div>
      </div>
    );
  }

  // Calculate total products in show
  const totalProducts =
    show.showProducts?.reduce(
      (total, product) => total + product.quantity,
      0
    ) || 0;

  return (
    <div className="container mx-auto p-4">
      <Link to="/shows" className="btn btn-outline btn-sm mb-4">
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Back to Shows
      </Link>

      <div className="bg-base-100 rounded-lg shadow-xl overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={show.image}
              alt={show.title}
              className="w-full h-96 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.png";
              }}
            />
          </div>
          <div className="p-6 md:w-1/2">
            <div className="flex flex-wrap gap-2 mb-2">
              <div className="badge badge-secondary">{show.showType.name}</div>
              <div className="badge badge-outline">{show.brand.name}</div>
              <div className="badge badge-outline">{show.category.name}</div>
              {show.inStock ? (
                <div className="badge badge-success">In Stock</div>
              ) : (
                <div className="badge badge-error">Out of Stock</div>
              )}
            </div>

            <h1 className="text-3xl font-bold mb-2">{show.title}</h1>
            <p className="text-xl badge badge-primary p-3 mb-2">
              ${parseFloat(show.casePrice.toString()).toFixed(2)}
            </p>
            <p className="text-sm mb-4">
              {totalProducts} products included in this show
            </p>

            <div className="my-4">
              {show.description ? (
                <p className="mb-6">{show.description}</p>
              ) : (
                <p className="text-base-content/70 mb-6">
                  No description available for this show.
                </p>
              )}
            </div>

            {show.videoURL && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Video Demo</h3>
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={show.videoURL.replace("watch?v=", "embed/")}
                    title="Show Video"
                    className="w-full h-64"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            {authState === "authenticated" ? (
              <button
                className="btn btn-primary btn-lg mt-4 w-full md:w-auto"
                onClick={handleAddShowToCart}
                disabled={!show.inStock || addToCart.isPending}
              >
                {addToCart.isPending ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Adding to Cart...
                  </>
                ) : (
                  <>
                    Add Show to Cart
                    <FontAwesomeIcon icon={faCartPlus} className="ml-2" />
                  </>
                )}
              </button>
            ) : (
              <div className="alert alert-info mt-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-current shrink-0 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>Please sign in to add this show to your cart</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t">
          <h2 className="text-2xl font-bold mb-4">Products Included</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {show.showProducts.map((showProduct: ShowProduct) => (
                  <tr key={showProduct.id} className="hover">
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img
                              src={showProduct.product.image}
                              alt={showProduct.product.title}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/placeholder.png";
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">
                            {showProduct.product.title}
                          </div>
                          <div className="text-sm opacity-50">
                            {showProduct.product.brand?.name} ·{" "}
                            {showProduct.product.sku}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div
                        className={`badge  ${showProduct.isUnit ? "badge-secondary" : "badge-primary"}`}
                      >
                        {showProduct.isUnit ? (
                          <>
                            <FontAwesomeIcon icon={faBox} />
                            Unit
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faBoxes} />
                            Case
                          </>
                        )}
                      </div>
                    </td>
                    <td>{showProduct.quantity}</td>
                    <td>{showProduct.notes || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
