import { Link, createFileRoute } from "@tanstack/react-router";
import { userInfoQueryOptions } from "../../../api/users/userQueryOptions.api";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightLong, faX } from "@fortawesome/free-solid-svg-icons";
import { ProfileCard } from "../../../components/ProfileCard";
import Cart from "../../../components/cart";
import { cartItemsQueryOptions } from "../../../api/cart/cartQueries";
import ThemeSelector from "../../../components/component-parts/themeSelector";

export const Route = createFileRoute("/_auth/profile/")({
  loader: async ({ context: { queryClient, auth } }) => {
    await queryClient.prefetchQuery(userInfoQueryOptions(auth.user!.token!));
    await queryClient.prefetchQuery(
      cartItemsQueryOptions(auth.user!.userInfo!.Cart.id)
    );
  },
  component: () => <ProfilePage />,
});

const ProfilePage = () => {
  const { auth } = Route.useRouteContext();
  const {
    data: userProfile,
    isLoading,
    isError,
    error,
  } = useQuery(userInfoQueryOptions(auth.user!.token!));
  const { data: cart } = useQuery(
    cartItemsQueryOptions(auth.user!.userInfo!.Cart.id)
  );

  if (isLoading)
    return <div className="text-center py-4">Loading Profile ...</div>;
  if (isError)
    return (
      <div role="alert" className="alert alert-error m-4">
        <FontAwesomeIcon icon={faX} /> Error Loading Profile: {error.message}
      </div>
    );

  return (
    <div className="flex flex-col items-center lg:flex-row justify-center space-y-4 p-4">
      <div className="lg:hidden">
        <ThemeSelector />
      </div>
      <ProfileCard
        userProfile={userProfile!}
        userEmail={auth.user!.userInfo!.email!}
      />

      <div className="flex flex-col space-y-3 justify-center w-full lg:w-auto">
        <Cart
          products={cart!.CartProducts}
          shippingAddress={
            userProfile!.shippingAddress ?? {
              id: "",
              street1: "",
              state: "",
              city: "",
              postalCode: "",
            }
          }
        />
        {cart!.CartProducts.length > 1 && (
          <Link
            to="/profile/cart/$cartId"
            params={{ cartId: auth.user!.userInfo!.Cart.id }}
            className="btn btn-wide btn-accent mx-auto"
          >
            Go To Cart <FontAwesomeIcon icon={faRightLong} className="ml-2" />
          </Link>
        )}
      </div>
    </div>
  );
};
