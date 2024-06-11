import { createFileRoute } from "@tanstack/react-router";
import Cart from "../../../../../components/cart";
import { cartItemsQueryOptions } from "../../../../../api/cart/cartQueries";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_auth/profile/cart/$cartId/")({
  loader: async ({ context: { queryClient }, params: { cartId } }) => {
    await queryClient.prefetchQuery(cartItemsQueryOptions(cartId));
  },
  component: CartPage,
});

function CartPage() {
  const { cartId } = Route.useParams();
  const products = useQuery(cartItemsQueryOptions(cartId));

  return (
    <div className="p-8 w-3/5 mx-auto">
      <Cart products={products.data!.products} />
    </div>
  );
}
