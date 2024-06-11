import { Link, createFileRoute } from "@tanstack/react-router";
import { userInfoQueryOptions } from "../../../api/users/userQueryOptions.api";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightLong, faX } from "@fortawesome/free-solid-svg-icons";
import { ProfileCard } from "../../../components/ProfileCard";
import Cart from "../../../components/cart";
import { cartItemsQueryOptions } from "../../../api/cart/cartQueries";

export const Route = createFileRoute("/_auth/profile/")({
  loader: async ({ context: { queryClient, auth } }) => {
    await queryClient.prefetchQuery(userInfoQueryOptions(auth.user!.token!));
    await queryClient.prefetchQuery(
      cartItemsQueryOptions(auth.user!.userInfo!.Cart.id)
    );
  },
  component: () => <ProfilePage />,
});

// Create Profile Page
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

  if (isLoading) return <>Loading Profile ...</>;
  if (isError)
    return (
      <>
        <div role="alert" className="alert alert-error">
          <FontAwesomeIcon icon={faX} /> Error Loading Profile {error.message}
        </div>
      </>
    );
  return (
    <div className="flex justify-center space-x-4 py-4">
      <ProfileCard
        userProfile={userProfile!}
        userEmail={auth.user!.userInfo!.email!}
      />
      <div className=" flex flex-col space-y-3 justify-center">
        <Cart products={cart!.products} />
        <Link
          to="/profile/cart/$cartId"
          params={{ cartId: auth.user!.userInfo!.Cart.id }}
          className="btn btn-wide btn-accent mx-auto"
        >
          Go To Cart <FontAwesomeIcon icon={faRightLong} />
        </Link>
      </div>
    </div>
  );
};
