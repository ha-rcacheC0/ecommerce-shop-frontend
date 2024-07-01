import { createFileRoute } from "@tanstack/react-router";
import Cart from "../../../../../components/cart";
import { cartItemsQueryOptions } from "../../../../../api/cart/cartQueries";
import { useQuery } from "@tanstack/react-query";

import { userInfoQueryOptions } from "../../../../../api/users/userQueryOptions.api";

export const Route = createFileRoute("/_auth/profile/cart/$cartId/")({
  loader: async ({ context: { queryClient, auth }, params: { cartId } }) => {
    await queryClient.prefetchQuery(cartItemsQueryOptions(cartId, true));
    await queryClient.prefetchQuery(userInfoQueryOptions(auth.user!.token!));
  },
  component: CartPage,
});

function CartPage() {
  const { cartId } = Route.useParams();
  const { auth } = Route.useRouteContext();
  const { data: products } = useQuery(cartItemsQueryOptions(cartId, true));
  const { data: userProfile } = useQuery(
    userInfoQueryOptions(auth.user!.token!)
  );

  return (
    <div className="p-8 w-3/5 mx-auto">
      <Cart
        products={products!.CartProducts}
        shippingAddress={
          userProfile!.shippingAddress ?? {
            street1: "",
            state: "",
            city: "",
            postalCode: "",
          }
        }
      />
    </div>
  );
}
