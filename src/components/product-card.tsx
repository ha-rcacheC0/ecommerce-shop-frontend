import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { useAddItemToCartMutation } from "../api/cart/cartQueries";
import { useAuth } from "../providers/auth.provider";
import type { ProductFilters, TProduct } from "../types";

export const ProductCard = ({
	product,
	searchParams,
}: {
	product: TProduct;
	searchParams: ProductFilters;
}) => {
	const packageString = product.package.join("/");
	const unitPackageString = product.unitProduct?.package.join("/");
	const { authState, user } = useAuth();
	const userCartId = user?.userInfo?.cart?.id;

	const addItem = useAddItemToCartMutation(
		userCartId!,
		() => {
			toast.success(`${product.title} added to cart!`, {
				position: "bottom-right",
			});
		},
		() => {
			toast.error("Failed to add product to cart", {
				position: "bottom-right",
			});
		},
	);

	return (
		<div className="flex flex-col h-full bg-base-100 shadow-md shadow-secondary rounded-sm hover:shadow-xl transition-shadow duration-300">
			<figure className="relative">
				<div className="badge badge-accent absolute top-2 left-2 z-10">
					SKU: {product.sku}
				</div>
				<Link
					to="/products/$productId"
					params={{ productId: product.id.toString() }}
					search={searchParams}
				>
					<img
						className="w-full h-[280px] object-contain object-center"
						src={product.image}
						alt={product.title}
					/>
				</Link>
			</figure>

			<div className="flex flex-col flex-grow p-4">
				<Link
					to="/products/$productId"
					params={{ productId: product.id.toString() }}
					search={searchParams}
					className="mb-4"
				>
					<h2 className="card-title text-xl font-bold  line-clamp-2 h-14">
						{product.title}
					</h2>
				</Link>

				<div className="flex flex-col gap-4 mt-auto">
					<div className="grid grid-cols-2 gap-2">
						<div className="flex flex-col items-center">
							<div className="badge badge-secondary text-xs p-3 mb-2">
								Case: {packageString}
							</div>
							<div className="badge badge-primary text-xl font-semibold p-3">
								${parseFloat(product.casePrice.toString()).toFixed(2)}
							</div>
						</div>
						{product.unitProduct && (
							<div className="flex flex-col items-center">
								<div className="badge badge-secondary text-xs p-3 mb-2">
									Unit: {unitPackageString}
								</div>
								<div className="badge badge-primary text-xl font-semibold p-3">
									${parseFloat(product.unitProduct.unitPrice).toFixed(2)}
								</div>
							</div>
						)}
					</div>

					<div className="grid grid-cols-2 gap-2 mt-2">
						{authState === "authenticated" ? (
							product.inStock ? (
								<>
									<button
										className="btn btn-secondary btn-outline"
										onClick={() =>
											addItem.mutate({
												productId: product.id,
												cartId: userCartId!,
												isUnit: false,
											})
										}
									>
										Add Case <FontAwesomeIcon icon={faCartPlus} />
									</button>

									{product.unitProduct && (
										<button
											className="btn btn-secondary btn-outline"
											onClick={() =>
												addItem.mutate({
													productId: product.id,
													cartId: userCartId!,
													isUnit: true,
												})
											}
										>
											Add Unit <FontAwesomeIcon icon={faCartPlus} />
										</button>
									)}
								</>
							) : (
								<div className="col-span-2">
									<div className="badge badge-error badge-lg w-full py-4">
										Currently Out of Stock
									</div>
								</div>
							)
						) : (
							<div className="col-span-2 text-center text-sm">
								Please{" "}
								<Link to="/user/login" className="text-primary hover:underline">
									sign-in
								</Link>{" "}
								to add product to cart
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
