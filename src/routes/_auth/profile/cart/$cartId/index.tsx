import { cartItemsQueryOptions } from "@api/cart/cartQueries";
import { userInfoQueryOptions } from "@api/users/userQueryOptions.api";
import Cart from "@components/cart";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/profile/cart/$cartId/")({
	loader: async ({ context: { queryClient, auth }, params: { cartId } }) => {
		await queryClient.prefetchQuery(
			userInfoQueryOptions(auth.user?.token ?? ""),
		);
		await queryClient.prefetchQuery(cartItemsQueryOptions(cartId, true));
	},
	component: CartPage,
});

function CartPage() {
	const { cartId } = Route.useParams();
	const { auth } = Route.useRouteContext();
	const { data: products } = useQuery(cartItemsQueryOptions(cartId, true));
	const { data: userProfile } = useQuery(
		userInfoQueryOptions(auth.user?.token ?? ""),
	);

	return (
		<div className="p-4 md:p-8 w-full md:w-11/12 lg:w-4/5 xl:w-3/4 mx-auto">
			<Cart
				products={products?.cartProducts ?? []}
				shippingAddress={
					userProfile?.shippingAddress ?? {
						id: "",
						street1: "",
						state: "MD",
						city: "",
						postalCode: "",
					}
				}
			/>
		</div>
	);
}
