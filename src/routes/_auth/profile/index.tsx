import { Link, createFileRoute } from "@tanstack/react-router";
import { userInfoQueryOptions } from "../../../api/users/userQueryOptions.api";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightLong, faX } from "@fortawesome/free-solid-svg-icons";
import { ProfileCard } from "../../../components/ProfileCard";
import Cart from "../../../components/cart";

export const Route = createFileRoute("/_auth/profile/")({
  loader: async ({ context: { queryClient, auth } }) => {
    console.log("Loader");
    await queryClient.prefetchQuery(userInfoQueryOptions(auth.user!.token!));
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
  const items = [
    { name: "Product 1", sku: "12345", price: 29.99 },
    { name: "Product 2", sku: "67890", price: 59.99 },
  ];

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const shipping = 5.99;
  const grandTotal = subtotal + shipping;

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
      <div className="space-y-3">
        <Cart
          items={items}
          subtotal={subtotal}
          shipping={shipping}
          grandTotal={grandTotal}
        />
        <Link to="/profile/cart" className="btn btn-wide btn-accent">
          Go To Cart <FontAwesomeIcon icon={faRightLong} />
        </Link>
      </div>
    </div>
  );
};
