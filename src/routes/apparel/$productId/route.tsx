import { useAddItemToCartMutation } from "@api/cart/cartQueries";
import { getOneProductQuery } from "@api/products/products";
import { getOneProductQueryOptions } from "@api/products/productsQueries";
import {
	faArrowLeft,
	faCartPlus,
	faCheck,
	faShirt,
	faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "@providers/auth.provider";
import { useQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	Link,
	useParams,
	useSearch,
} from "@tanstack/react-router";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import { BrandDisplay, CategoryDisplay, type ProductVariant } from "@/types";

const ApparelProductDetailPage = () => {
	const { productId } = useParams({ from: "/apparel/$productId" });
	const { user, authState } = useAuth();
	const search = useSearch({ from: "/apparel/$productId" });

	// State for variant selection
	const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
		null,
	);
	const [imageError, setImageError] = useState(false);

	const product = useQuery({
		queryKey: ["product", productId],
		queryFn: () => getOneProductQuery({ id: productId }),
	});

	// Set initial variant when product loads
	React.useEffect(() => {
		if (
			product.data?.variants &&
			product.data.variants.length > 0 &&
			!selectedVariant
		) {
			setSelectedVariant(product.data.variants[0]);
		}
	}, [product.data, selectedVariant]);

	const userCartId = user?.userInfo?.cart?.id;
	const addItem = useAddItemToCartMutation(
		userCartId || "",
		() => {
			toast.success(
				`${product.data?.title} (${selectedVariant?.size} - ${genderDisplay[selectedVariant?.gender || "UNISEX"]}) added to cart!`,
				{
					position: "bottom-right",
				},
			);
		},
		() => {
			toast.error("Failed to add product to cart", {
				position: "bottom-right",
			});
		},
	);

	// Helper functions
	const genderDisplay = {
		MALE: "Men's",
		FEMALE: "Women's",
		UNISEX: "Unisex",
	};

	const handleImageError = () => {
		setImageError(true);
	};

	const getImageSrc = () => {
		if (
			imageError ||
			!product.data?.image ||
			product.data.image === "placeholder"
		) {
			return "/images/placeholder-apparel.jpg";
		}
		return product.data.image;
	};

	const formatPrice = (price: number | string) => {
		const numPrice = typeof price === "string" ? parseFloat(price) : price;
		return numPrice.toFixed(2);
	};

	// Get unique options from variants
	const availableSizes = Array.from(
		new Set(product.data?.variants?.map((v) => v.size) || []),
	);

	const availableGenders = Array.from(
		new Set(product.data?.variants?.map((v) => v.gender) || []),
	);

	// Get available colors for selected size and gender
	const availableColors =
		product.data?.variants?.filter(
			(variant) =>
				variant.size === selectedVariant?.size &&
				variant.gender === selectedVariant?.gender,
		) || [];

	// Variant selection handlers
	const handleSizeChange = (size: string) => {
		const newVariant =
			product.data?.variants?.find(
				(v) => v.size === size && v.gender === selectedVariant?.gender,
			) || product.data?.variants?.find((v) => v.size === size);

		if (newVariant) {
			setSelectedVariant(newVariant);
		}
	};

	const handleGenderChange = (gender: "MALE" | "FEMALE" | "UNISEX") => {
		const newVariant =
			product.data?.variants?.find(
				(v) => v.gender === gender && v.size === selectedVariant?.size,
			) || product.data?.variants?.find((v) => v.gender === gender);

		if (newVariant) {
			setSelectedVariant(newVariant);
		}
	};

	const handleColorChange = (colorId: string | null) => {
		const newVariant = product.data?.variants?.find(
			(v) =>
				v.size === selectedVariant?.size &&
				v.gender === selectedVariant?.gender &&
				v.colorId === colorId,
		);

		if (newVariant) {
			setSelectedVariant(newVariant);
		}
	};

	const isInStock =
		selectedVariant?.availableStock && selectedVariant.availableStock > 0;

	if (product.isFetching) {
		return (
			<div className="container p-10 h-svh flex mx-auto gap-4 justify-around">
				<div className="skeleton w-[620px] h-[620px]"></div>
				<div className="flex flex-col gap-4 w-1/3">
					<div className="flex gap-4 w-full justify-center pt-8">
						<div className="skeleton h-16 w-1/2"></div>
						<div className="skeleton h-16 w-1/2"></div>
					</div>
					<div className="skeleton h-12 w-full"></div>
					<div className="skeleton h-32 w-full"></div>
					<div className="skeleton h-10 w-full"></div>
					<div className="skeleton h-10 w-full"></div>
					<div className="skeleton h-10 w-full"></div>
					<div className="flex gap-4 w-full justify-center pt-8">
						<div className="skeleton h-16 w-1/2"></div>
						<div className="skeleton h-16 w-1/2"></div>
					</div>
				</div>
			</div>
		);
	}

	if (!product.data?.isApparel) {
		return (
			<div className="container mx-auto p-10 text-center">
				<h1 className="text-2xl font-bold text-error">
					This product is not an apparel item.
				</h1>
				<Link to="/apparel" className="btn btn-primary mt-4">
					Back to Apparel
				</Link>
			</div>
		);
	}

	return (
		<>
			<Link
				to="/apparel"
				search={{
					page: search.page ? Number(search.page) : 1,
					pageSize: search.pageSize ? Number(search.pageSize) : 25,
					brands: search.brands,
					categories: search.categories,
					colors: search.colors,
					apparelTypes: search.apparelTypes,
					genders: search.genders,
					sizes: search.sizes,
					searchTitle: search.searchTitle,
				}}
				className="btn btn-outline btn-sm m-4"
			>
				<FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
				Back to Apparel
			</Link>

			<div className="p-10 w-full flex items-center justify-around bg-base-100 max-lg:flex-col">
				{/* Mobile Header */}
				<div className="flex gap-4 w-full justify-between text-base-content lg:hidden">
					<h2>Category: {product.data?.category.name}</h2>
					<h2>Brand: {product.data?.brand.name}</h2>
				</div>
				<h1 className="text-3xl font-bold text-base-content underline lg:hidden">
					{product.data?.title}
				</h1>

				{/* Product Image */}
				<div className="flex flex-col items-center">
					<img
						className="max-w-[520px] w-full h-[520px] object-center object-contain"
						src={getImageSrc()}
						alt={product.data?.title}
						onError={handleImageError}
					/>
				</div>

				{/* Product Details */}
				<div className="flex flex-col gap-6 max-w-lg">
					{/* Desktop Header */}
					<h1 className="text-4xl font-bold text-base-content underline max-lg:hidden">
						{product.data?.title}
					</h1>
					{/* Apparel Type Badge */}
					{product.data?.apparelType && (
						<div className="badge badge-primary badge-lg mt-4">
							<FontAwesomeIcon icon={faShirt} className="mr-2" />
							{product.data.apparelType.name}
						</div>
					)}
					<div className="flex gap-4 w-full justify-between text-base-content max-lg:hidden">
						<h2>Category: {CategoryDisplay[product.data?.category.name]}</h2>
						<h2>Brand: {BrandDisplay[product.data?.brand.name]}</h2>
					</div>

					{/* Description */}
					<div>
						<h3 className="text-xl font-semibold mb-2">Description</h3>
						<p className="text-base-content">
							{product.data?.description || "No description available."}
						</p>
					</div>

					{/* Variant Selection */}
					<div className="bg-base-200 p-4 rounded-lg">
						<h3 className="text-xl font-semibold mb-4">Select Options</h3>

						{/* Size Selection */}
						{availableSizes.length > 0 && (
							<div className="mb-4">
								<label className="text-sm font-medium mb-2 block">Size:</label>
								<div className="flex flex-wrap gap-2">
									{availableSizes.map((size) => (
										<button
											key={size}
											className={`btn btn-sm ${
												selectedVariant?.size === size
													? "btn-primary"
													: "btn-outline"
											}`}
											onClick={() => handleSizeChange(size)}
										>
											{size}
										</button>
									))}
								</div>
							</div>
						)}

						{/* Gender Selection */}
						{availableGenders.length > 1 && (
							<div className="mb-4">
								<label className="text-sm font-medium mb-2 block">Style:</label>
								<div className="flex flex-wrap gap-2">
									{availableGenders.map((gender) => (
										<button
											key={gender}
											className={`btn btn-sm ${
												selectedVariant?.gender === gender
													? "btn-secondary"
													: "btn-outline"
											}`}
											onClick={() => handleGenderChange(gender)}
										>
											{genderDisplay[gender]}
										</button>
									))}
								</div>
							</div>
						)}

						{/* Color Selection */}
						{availableColors.length > 1 && (
							<div className="mb-4">
								<label className="text-sm font-medium mb-2 block">Color:</label>
								<div className="flex flex-wrap gap-2">
									{availableColors.map((variant) => (
										<button
											key={variant.id}
											className={`btn btn-sm ${
												selectedVariant?.colorId === variant.colorId
													? "btn-accent"
													: "btn-outline"
											}`}
											onClick={() => handleColorChange(variant.colorId)}
										>
											{variant.color?.name || "Default"}
										</button>
									))}
								</div>
							</div>
						)}

						{/* Selected Variant Summary */}
						{selectedVariant && (
							<div className="bg-base-100 p-3 rounded border-2 border-primary">
								<h4 className="font-medium mb-2">Selected:</h4>
								<div className="flex flex-wrap gap-2 text-sm">
									<span className="badge badge-outline">
										Size: {selectedVariant.size}
									</span>
									<span className="badge badge-outline">
										Style: {genderDisplay[selectedVariant.gender]}
									</span>
									{selectedVariant.color && (
										<span className="badge badge-outline">
											Color: {selectedVariant.color.name}
										</span>
									)}
								</div>
								<div className="mt-2 text-xs text-gray-500 font-mono">
									SKU: {selectedVariant.sku}
								</div>
							</div>
						)}
					</div>

					{/* Pricing and Add to Cart */}
					<div className="bg-base-200 p-4 rounded-lg">
						<div className="flex items-center justify-between mb-4">
							<div>
								<h3 className="text-2xl font-bold text-primary">
									$
									{selectedVariant
										? formatPrice(selectedVariant.unitPrice)
										: "Select Options"}
								</h3>
								<p className="text-sm text-gray-600">Per Item</p>
							</div>

							{/* Stock Status */}
							<div className="text-right">
								{selectedVariant ? (
									<div
										className={`flex items-center gap-2 ${isInStock ? "text-success" : "text-error"}`}
									>
										<FontAwesomeIcon icon={isInStock ? faCheck : faTimes} />
										<span className="font-medium">
											{isInStock ? "In Stock" : "Out of Stock"}
										</span>
									</div>
								) : (
									<span className="text-gray-500">
										Select options to see stock
									</span>
								)}
							</div>
						</div>

						{/* Add to Cart Button */}
						<div className="w-full">
							{authState === "authenticated" ? (
								<button
									className="btn btn-primary btn-wide w-full"
									disabled={!selectedVariant || !isInStock}
									onClick={() =>
										selectedVariant &&
										addItem.mutate({
											productId: product.data?.id,
											cartId: userCartId!,
											isUnit: true,
											variantId: selectedVariant.id,
										})
									}
								>
									{!selectedVariant
										? "Select Options First"
										: !isInStock
											? "Out of Stock"
											: "Add to Cart"}
									{selectedVariant && isInStock && (
										<FontAwesomeIcon icon={faCartPlus} className="ml-2" />
									)}
								</button>
							) : (
								<div className="text-center">
									<p className="mb-2">Please sign in to add items to cart</p>
									<Link to="/user/login" className="btn btn-outline">
										Sign In
									</Link>
								</div>
							)}
						</div>
					</div>

					{/* Video */}
					{product.data?.videoURL && (
						<div>
							<h3 className="text-xl font-semibold mb-2">Product Video</h3>
							<iframe
								src={product.data.videoURL.replace("watch?v=", "embed/")}
								className="w-full aspect-video rounded"
								title={`${product.data.title} video`}
								allowFullScreen
							/>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export const Route = createFileRoute("/apparel/$productId")({
	component: () => <ApparelProductDetailPage />,
	validateSearch: z.object({
		page: z.coerce.number().optional(),
		pageSize: z.coerce.number().optional(),
		brands: z.union([z.string(), z.array(z.string())]).optional(),
		categories: z.union([z.string(), z.array(z.string())]).optional(),
		colors: z.union([z.string(), z.array(z.string())]).optional(),
		apparelTypes: z.union([z.string(), z.array(z.string())]).optional(),
		genders: z.union([z.string(), z.array(z.string())]).optional(),
		sizes: z.union([z.string(), z.array(z.string())]).optional(),
		searchTitle: z.string().optional(),
	}),
	loader: ({ context: { queryClient }, params: { productId } }) => {
		queryClient.ensureQueryData(getOneProductQueryOptions({ id: productId }));
	},
});
