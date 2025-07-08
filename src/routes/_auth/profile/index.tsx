import { Link, createFileRoute } from "@tanstack/react-router";
import { userInfoQueryOptions } from "@api/users/userQueryOptions.api";
import { useQuery } from "@tanstack/react-query";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ProfileCard } from "@components/ProfileCard";
import Cart from "@components/cart";
import { cartItemsQueryOptions } from "@api/cart/cartQueries";

export const Route = createFileRoute("/_auth/profile/")({
  loader: async ({ context: { queryClient, auth } }) => {
    await queryClient.prefetchQuery(userInfoQueryOptions(auth.user!.token!));
    await queryClient.prefetchQuery(
      cartItemsQueryOptions(auth.user!.userInfo!.Cart!.id)
    );
  },
  component: ProfilePage,
});

function ProfilePage() {
  const { auth } = Route.useRouteContext();
  const {
    data: userProfile,
    isLoading,
    isError,
    error,
  } = useQuery(userInfoQueryOptions(auth.user!.token!));

  const { data: cart } = useQuery(
    cartItemsQueryOptions(auth.user!.userInfo!.Cart!.id)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4 text-base-content/70">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="bg-base-100 p-8 rounded-lg shadow-lg max-w-md w-full">
          <div role="alert" className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              Error loading profile:{" "}
              {error instanceof Error ? error.message : "Unknown error"}
            </span>
          </div>
          <div className="mt-4 text-center">
            <Link to="/" className="btn btn-primary">
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-base-content mb-8 text-center">
          Your Account
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}

          <ProfileCard
            userProfile={userProfile!}
            userEmail={auth.user!.userInfo!.email!}
          />

          {/* Cart Section */}
          <div className="flex flex-col">
            <div className="card bg-base-100 shadow-xl w-full overflow-hidden">
              {/* Card Header (similar to ProfileCard) */}
              <div className="bg-primary text-primary-content p-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Your Cart</h2>
                  {cart!.cartProducts.length > 0 && (
                    <Link
                      to="/profile/cart/$cartId"
                      params={{ cartId: auth.user!.userInfo!.Cart!.id }}
                      className="btn btn-sm btn-ghost"
                    >
                      View Full Cart{" "}
                      <FontAwesomeIcon icon={faShoppingCart} className="ml-2" />
                    </Link>
                  )}
                </div>
              </div>
              {/* Cart Content */}
              <div className="p-6 bg-base-100 flex-grow">
                <Cart
                  products={cart!.cartProducts}
                  shippingAddress={
                    userProfile!.shippingAddress ?? {
                      id: "",
                      street1: "",
                      state: "ND",
                      city: "",
                      postalCode: "",
                    }
                  }
                />

                {cart!.cartProducts.length > 0 && (
                  <div className="mt-4 md:hidden">
                    <Link
                      to="/profile/cart/$cartId"
                      params={{ cartId: auth.user!.userInfo!.Cart!.id }}
                      className="btn btn-primary w-full"
                    >
                      View Full Cart{" "}
                      <FontAwesomeIcon icon={faShoppingCart} className="ml-2" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
