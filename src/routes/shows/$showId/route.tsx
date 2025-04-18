import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getShowByIdQueryOptions } from "../../../api/shows/showsQueries";
import { useAuth } from "../../../providers/auth.provider";
import { useAddItemToCartMutation } from "../../../api/cart/cartQueries";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ShowProduct } from "../../../types";

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

  const userCartId = user?.userInfo?.Cart.id;

  // This is a placeholder - you'll need to implement a cart mutation for adding a whole show
  const addToCart = useAddItemToCartMutation(
    userCartId!,
    () => {
      toast.success(`${show?.title} added to cart!`, {
        position: "bottom-right",
      });
    },
    () => {
      toast.error("Failed to add show to cart", {
        position: "bottom-right",
      });
    }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">Loading show details...</div>
    );
  }

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
              src={show?.image}
              alt={show?.title}
              className="w-full h-96 object-cover"
            />
          </div>
          <div className="p-6 md:w-1/2">
            <div className="badge badge-secondary mb-2">
              {show?.showType.name}
            </div>
            <h1 className="text-3xl font-bold mb-2">{show?.title}</h1>
            <p className="text-xl font-semibold text-primary mb-4">
              ${parseFloat(show?.casePrice || "0.00").toFixed(2)}
            </p>
            <p className="mb-6">{show?.description}</p>

            {show?.videoURL && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Video Demo</h3>
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={show?.videoURL.replace("watch?v=", "embed/")}
                    title="Show Video"
                    className="w-full h-64"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            {authState === "authenticated" ? (
              <button
                className="btn btn-primary btn-lg mt-4"
                onClick={() => {
                  addToCart;
                  toast.info("Show add to cart functionality coming soon!");
                }}
              >
                Add Show to Cart{" "}
                <FontAwesomeIcon icon={faCartPlus} className="ml-2" />
              </button>
            ) : (
              <p className="mt-4">
                Please sign in to add this show to your cart
              </p>
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
                  <th>Quantity</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {show?.showProducts.map((showProduct: ShowProduct) => (
                  <tr key={showProduct.id}>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img
                              src={showProduct.product.image}
                              alt={showProduct.product.title}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">
                            {showProduct.product.title}
                          </div>
                          <div className="text-sm opacity-50">
                            {showProduct.product.brand?.name} -{" "}
                            {showProduct.product.category?.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{showProduct.quantity}</td>
                    <td>{showProduct.notes || "N/A"}</td>
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
