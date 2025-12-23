import { faBox, faBoxes, faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { useAddItemToCartMutation } from "../api/cart/cartQueries";
import { useAuth } from "../providers/auth.provider";
import type { ShowProduct, ShowWithProducts } from "../types";

interface ShowCardProps {
	show: ShowWithProducts;
}

export const ShowCard: React.FC<ShowCardProps> = ({ show }) => {
	const { authState, user } = useAuth();
	const userCartId = user?.userInfo?.cart?.id;
	const addToCart = useAddItemToCartMutation(
		userCartId ?? "",
		() => {
			toast.success(`${show?.title} added to cart!`, {
				position: "bottom-right",
			});
		},
		(error) => {
			toast.error(`Failed to add show to cart: ${error.message}`, {
				position: "bottom-right",
			});
		},
	);

	// Function to handle adding the entire show to cart
	const handleAddShowToCart = () => {
		if (!show || !userCartId) return;

		addToCart.mutate({
			productId: show.id,
			cartId: userCartId,
			isUnit: false,
		});
	};
	const totalProducts = show.showProducts.reduce(
		(sum: number, product: ShowProduct) => sum + product.quantity,
		0,
	);
	const unitProducts = show.showProducts.filter(
		(product: ShowProduct) => product.isUnit,
	).length;

	const caseProducts = show.showProducts.filter(
		(product: ShowProduct) => !product.isUnit,
	).length;

	return (
		<div className="card shadow-xl shadow-secondary overflow-hidden hover:shadow-2xl transition-shadow">
			<figure className="relative">
				<img
					src={show.image}
					alt={show.title}
					className="h-48 w-full object-contain object-center"
				/>
				<div className="badge badge-secondary badge-sm absolute top-2 left-2 z-10">
					{show.showType.name}
				</div>
			</figure>
			<div className="card-body">
				<div className="flex justify-between items-center">
					<h2 className="text-2xl font-bold">{show.title}</h2>
					<span className="text-xl">${show.casePrice}</span>
				</div>
				<p className="text-sm">
					{show.description && show.description?.length > 100
						? `${show.description.substring(0, 100)}...`
						: show.description}
				</p>
				<div className="text-sm text-gray-600 mt-2 space-y-1">
					<div className="flex items-center gap-2">
						<span className="font-semibold">{totalProducts}</span>
						{totalProducts === 1 ? "product" : "products"} included
					</div>

					{unitProducts > 0 && (
						<div className="flex items-center gap-2">
							<FontAwesomeIcon icon={faBox} className="text-secondary" />
							<span>
								{unitProducts} unit {unitProducts === 1 ? "item" : "items"}
							</span>
						</div>
					)}

					{caseProducts > 0 && (
						<div className="flex items-center gap-2">
							<FontAwesomeIcon icon={faBoxes} className="text-primary" />
							<span>
								{caseProducts} case {caseProducts === 1 ? "item" : "items"}
							</span>
						</div>
					)}
				</div>
				<div className="card-actions justify-end mt-4">
					<Link
						to="/shows/$showId"
						params={{ showId: show.id }}
						className="btn btn-primary btn-sm"
					>
						View Details
					</Link>
					{authState === "authenticated" && (
						<button
							className="btn btn-secondary btn-sm  "
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
					)}
				</div>
			</div>
		</div>
	);
};
