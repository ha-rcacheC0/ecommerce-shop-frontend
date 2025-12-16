/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/ApparelProductForm.tsx

import {
	getAllApparelTypesQueryOptions,
	getSkuPreviewQueryOptions,
	useCreateApparelMutation,
} from "@api/apparel/apparelQueries";
import {
	faCopy,
	faPlus,
	faSave,
	faSpinner,
	faTimes,
	faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getProductMetadataQueryOptions } from "@/api/metadata/metadataQueries";
import { useAuth } from "@/providers/auth.provider";

interface ProductVariantData {
	size: string;
	gender: "MALE" | "FEMALE" | "UNISEX";
	colorId?: string;
	unitPrice: string;
	availableStock: number;
}

interface ApparelProductFormProps {
	productId?: string;
	isEditing?: boolean;
}

const COMMON_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
const GENDERS = [
	{ value: "MALE", label: "Men's" },
	{ value: "FEMALE", label: "Women's" },
	{ value: "UNISEX", label: "Unisex" },
] as const;

const ApparelProductForm: React.FC<ApparelProductFormProps> = ({
	isEditing = false,
}) => {
	const navigate = useNavigate();
	const { user } = useAuth();

	// Basic product form state
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [casePrice, setCasePrice] = useState("");
	const [packageString, setPackageString] = useState("1,1"); // Default for apparel
	const [inStock, setInStock] = useState(true);
	const [imageUrl, setImageUrl] = useState("");
	const [selectedBrandId, setSelectedBrandId] = useState("");
	const [selectedCategoryId, setSelectedCategoryId] = useState("");
	const [selectedApparelTypeId, setSelectedApparelTypeId] = useState("");
	const [selectedColors, setSelectedColors] = useState<string[]>([]);

	// Variants state
	const [variants, setVariants] = useState<ProductVariantData[]>([
		{
			size: "M",
			gender: "UNISEX",
			colorId: "",
			unitPrice: "",
			availableStock: 999,
		},
	]);

	const { data: skuPreview, isLoading: skuPreviewLoading } = useQuery(
		getSkuPreviewQueryOptions(),
	);

	// Get metadata
	const { data: metadata, isLoading: metadataLoading } = useQuery(
		getProductMetadataQueryOptions(),
	);

	const { data: apparelTypes, isLoading: apparelTypesLoading } = useQuery(
		getAllApparelTypesQueryOptions(),
	);
	const { mutate } = useCreateApparelMutation(
		user?.token ?? "",
		() => {
			toast.success(
				isEditing
					? "Apparel product updated successfully!"
					: "Apparel product created successfully!",
			);
			navigate({ to: "/admin/apparel" });
		},
		(error: Error) => {
			toast.error(`Error creating apparel product: ${error.message}`);
		},
	);
	// Calculate estimated unit price based on case price and package
	const calculateUnitPrice = useCallback(() => {
		if (casePrice && packageString) {
			try {
				const casePriceNum = parseFloat(casePrice);
				const packageNums = packageString.split(",").map(Number);
				if (!Number.isNaN(casePriceNum) && packageNums[0] > 0) {
					return (casePriceNum / packageNums[0]).toFixed(2);
				}
			} catch (_e) {
				// Ignore calculation errors
			}
		}
		return "";
	}, [casePrice, packageString]);

	// Update variant unit prices when case price or package changes
	useEffect(() => {
		const estimatedUnitPrice = calculateUnitPrice();
		if (estimatedUnitPrice) {
			setVariants((prev) =>
				prev.map((variant) => ({
					...variant,
					unitPrice: variant.unitPrice || estimatedUnitPrice,
				})),
			);
		}
	}, [calculateUnitPrice]);

	// Handle adding a new variant
	const addVariant = () => {
		const estimatedUnitPrice = calculateUnitPrice();
		setVariants([
			...variants,
			{
				size: "M",
				gender: "UNISEX",
				colorId: "",
				unitPrice: estimatedUnitPrice,
				availableStock: 999,
			},
		]);
	};

	// Handle removing a variant
	const removeVariant = (index: number) => {
		if (variants.length > 1) {
			setVariants(variants.filter((_, i) => i !== index));
		}
	};

	// Handle duplicating a variant
	const duplicateVariant = (index: number) => {
		const variantToDuplicate = variants[index];
		setVariants([...variants, { ...variantToDuplicate }]);
	};

	// Update variant data
	const updateVariant = (
		index: number,
		field: keyof ProductVariantData,
		value: string | number,
	) => {
		setVariants((prev) =>
			prev.map((variant, i) =>
				i === index ? { ...variant, [field]: value } : variant,
			),
		);
	};

	// Bulk operations
	const fillSizesForAllGenders = () => {
		const newVariants: ProductVariantData[] = [];
		const estimatedUnitPrice = calculateUnitPrice();

		GENDERS.forEach((gender) => {
			COMMON_SIZES.forEach((size) => {
				selectedColors.forEach((colorId) => {
					newVariants.push({
						size,
						gender: gender.value,
						colorId: colorId || "",
						unitPrice: estimatedUnitPrice,
						availableStock: 999,
					});
				});
			});
		});

		setVariants(newVariants);
	};

	const applyPriceToAll = () => {
		const estimatedUnitPrice = calculateUnitPrice();
		if (estimatedUnitPrice) {
			setVariants((prev) =>
				prev.map((variant) => ({
					...variant,
					unitPrice: estimatedUnitPrice,
				})),
			);
		}
	};
	const generateSkuPreview = useCallback(
		(variant: ProductVariantData) => {
			if (!skuPreview?.nextSku) return "Loading...";

			const baseSku = skuPreview.nextSku; // e.g., "APP-0042"
			const genderCode = variant.gender[0];
			const sizeCode = variant.size.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

			let colorCode = "";
			if (variant.colorId) {
				const color = metadata?.colors?.find(
					(c: { id: string; name: string }) => c.id === variant.colorId,
				);
				if (color) {
					colorCode = `-${color.name
						.replace(/[^a-zA-Z0-9]/g, "")
						.substring(0, 3)
						.toUpperCase()}`;
				}
			}

			return `${baseSku}-${sizeCode}-${genderCode}${colorCode}`;
		},
		[metadata?.colors, skuPreview?.nextSku],
	);

	// Handle form submission
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Validation
		if (!title.trim()) {
			toast.error("Title is required");
			return;
		}

		if (!casePrice || parseFloat(casePrice) <= 0) {
			toast.error("Valid case price is required");
			return;
		}

		if (!selectedBrandId) {
			toast.error("Brand is required");
			return;
		}

		if (!selectedCategoryId) {
			toast.error("Category is required");
			return;
		}

		if (!selectedApparelTypeId) {
			toast.error("Apparel type is required");
			return;
		}

		if (variants.length === 0) {
			toast.error("At least one variant is required");
			return;
		}

		// Validate variants
		for (const variant of variants) {
			if (!variant.size.trim()) {
				toast.error("All variants must have a size");
				return;
			}
			if (!variant.unitPrice || parseFloat(variant.unitPrice) <= 0) {
				toast.error("All variants must have a valid unit price");
				return;
			}
		}

		// Check for duplicate variants
		const variantKeys = variants.map(
			(v) => `${v.size}-${v.gender}-${v.colorId || "none"}`,
		);
		if (new Set(variantKeys).size !== variantKeys.length) {
			toast.error(
				"Duplicate variants detected. Each size/gender/color combination must be unique.",
			);
			return;
		}

		// Prepare data
		const apparelProductData = {
			title,
			description,
			casePrice,
			inStock,
			package: packageString,
			image: imageUrl || "placeholder",
			brandId: selectedBrandId,
			categoryId: selectedCategoryId,
			apparelTypeId: selectedApparelTypeId,
			colors: selectedColors,
			variants: variants.map((variant) => ({
				size: variant.size,
				gender: variant.gender,
				colorId: variant.colorId || undefined,
				unitPrice: variant.unitPrice,
				availableStock: variant.availableStock,
			})),
		};

		mutate(apparelProductData);
	};

	const isLoading = metadataLoading || apparelTypesLoading || skuPreviewLoading;

	if (isLoading) {
		return (
			<div className="flex justify-center items-center p-8">
				<FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
				<span>Loading...</span>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6 bg-base-100 rounded-lg shadow-lg max-w-6xl">
			<h1 className="text-2xl font-bold mb-6">
				{isEditing ? `Edit Apparel Product` : "Create New Apparel Product"}
			</h1>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Basic Information */}
				<div className="bg-base-200 p-4 rounded-lg">
					<h2 className="text-xl font-semibold mb-4">Basic Information</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="label">
								<span className="label-text">Title *</span>
								<input
									type="text"
									className="input input-bordered w-full mt-1"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									required
									placeholder="e.g., Cool Design T-Shirt"
								/>
							</label>
						</div>

						<div>
							<label className="label">
								<span className="label-text">Case Price *</span>
								<input
									type="number"
									step="0.01"
									min="0"
									className="input input-bordered w-full mt-1"
									value={casePrice}
									onChange={(e) => setCasePrice(e.target.value)}
									required
									placeholder="120.00"
								/>
							</label>
						</div>
						{/* Add SKU preview section */}

						{!isEditing && skuPreview && (
							<div>
								<label className="label">
									<span className="label-text"> Preview Sku</span>
									<input
										type="text"
										step="0.01"
										min="0"
										className="input input-bordered w-full mt-1"
										value={skuPreview?.nextSku || ""}
										disabled
									/>
								</label>
								<div className="label">
									<span className="label-text-alt">
										Variant SKUs: {skuPreview.nextSku}
										-[SIZE]-[GENDER]-[COLOR]
									</span>
								</div>
							</div>
						)}
						<div>
							<label className="label">
								<span className="label-text">Package (items per case) *</span>
								<input
									type="text"
									className="input input-bordered w-full mt-1"
									value={packageString}
									onChange={(e) => setPackageString(e.target.value)}
									required
									placeholder="12,1"
								/>
							</label>
							<div className="label">
								<span className="label-text-alt">
									Estimated unit price: ${calculateUnitPrice()}
								</span>
							</div>
						</div>

						<div className="form-control">
							<label className="label cursor-pointer justify-start gap-4">
								<input
									type="checkbox"
									className="checkbox"
									checked={inStock}
									onChange={(e) => setInStock(e.target.checked)}
								/>
								<span className="label-text">In Stock</span>
							</label>
						</div>

						<div className="md:col-span-2">
							<label className="label">
								<span className="label-text">Description</span>
								<textarea
									className="textarea textarea-bordered w-full h-24 mt-1"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									placeholder="Product description..."
								/>
							</label>
						</div>

						<div>
							<label className="label">
								<span className="label-text">Image URL</span>
								<input
									type="url"
									className="input input-bordered w-full mt-1"
									value={imageUrl}
									onChange={(e) => setImageUrl(e.target.value)}
									placeholder="https://example.com/image.jpg"
								/>
							</label>
						</div>
					</div>
				</div>

				{/* Classification */}
				<div className="bg-base-200 p-4 rounded-lg">
					<h2 className="text-xl font-semibold mb-4">Classification</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<label className="label">
								<span className="label-text">Brand *</span>
								<select
									className="select select-bordered w-full mt-1"
									value={selectedBrandId}
									onChange={(e) => setSelectedBrandId(e.target.value)}
									required
								>
									<option value="">Select Brand</option>
									{metadata?.brands?.map(
										(brand: { id: string; name: string }) => (
											<option key={brand.id} value={brand.id}>
												{brand.name}
											</option>
										),
									)}
								</select>
							</label>
						</div>

						<div>
							<label className="label">
								<span className="label-text">Category *</span>
								<select
									className="select select-bordered w-full mt-1"
									value={selectedCategoryId}
									onChange={(e) => setSelectedCategoryId(e.target.value)}
									required
								>
									<option value="">Select Category</option>
									{metadata?.categories?.map(
										(category: { id: string; name: string }) => (
											<option key={category.id} value={category.id}>
												{category.name}
											</option>
										),
									)}
								</select>
							</label>
						</div>

						<div>
							<label className="label">
								<span className="label-text">Apparel Type *</span>
								<select
									className="select select-bordered w-full mt-1"
									value={selectedApparelTypeId}
									onChange={(e) => setSelectedApparelTypeId(e.target.value)}
									required
								>
									<option value="">Select Apparel Type</option>
									{apparelTypes?.map((type: { id: string; name: string }) => (
										<option key={type.id} value={type.id}>
											{type.name}
										</option>
									))}
								</select>
							</label>
						</div>
					</div>

					{/* Colors */}
					<div className="mt-4">
						<div className="label">
							<span className="label-text">Available Colors</span>
						</div>
						<div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
							{metadata?.colors?.map((color: { id: string; name: string }) => (
								<label
									key={color.id}
									className="flex items-center gap-2 cursor-pointer"
								>
									<input
										type="checkbox"
										className="checkbox checkbox-sm"
										checked={selectedColors.includes(color.id)}
										onChange={(e) => {
											if (e.target.checked) {
												setSelectedColors([...selectedColors, color.id]);
											} else {
												setSelectedColors(
													selectedColors.filter((id) => id !== color.id),
												);
											}
										}}
									/>
									<span className="text-sm">{color.name}</span>
								</label>
							))}
						</div>
					</div>
				</div>

				{/* Variants */}
				<div className="bg-base-200 p-4 rounded-lg">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-semibold">Product Variants</h2>
						<div className="flex gap-2">
							<button
								type="button"
								className="btn btn-sm btn-outline"
								onClick={fillSizesForAllGenders}
							>
								Fill All Sizes/Genders
							</button>
							<button
								type="button"
								className="btn btn-sm btn-outline"
								onClick={applyPriceToAll}
							>
								Apply Price to All
							</button>
							<button
								type="button"
								className="btn btn-sm btn-primary"
								onClick={addVariant}
							>
								<FontAwesomeIcon icon={faPlus} className="mr-1" />
								Add Variant
							</button>
						</div>
					</div>

					<div className="space-y-4  overflow-scroll max-h-94">
						{variants.map((variant, index) => (
							<div
								key={`${variant.size}-${variant.gender}-${variant.colorId || "none"}-${index}`}
								className="bg-base-100 p-4 rounded-lg border "
							>
								<div className="flex justify-between items-center mb-3">
									<h3 className="font-medium">Variant {index + 1}</h3>
									<div className="text-xs text-gray-500 mt-1">
										SKU Preview:{" "}
										<code className="bg-gray-100 px-1 rounded">
											{generateSkuPreview(variant)}
										</code>
									</div>
									<div className="flex gap-2">
										<button
											type="button"
											className="btn btn-xs btn-outline"
											onClick={() => duplicateVariant(index)}
										>
											<FontAwesomeIcon icon={faCopy} />
										</button>
										{variants.length > 1 && (
											<button
												type="button"
												className="btn btn-xs btn-error"
												onClick={() => removeVariant(index)}
											>
												<FontAwesomeIcon icon={faTrash} />
											</button>
										)}
									</div>
								</div>

								<div className="grid grid-cols-2 md:grid-cols-5 gap-3">
									<div>
										<label className="label">
											<span className="label-text text-xs">Size *</span>
											<select
												className="select select-bordered select-sm w-full mt-1"
												value={variant.size}
												onChange={(e) =>
													updateVariant(index, "size", e.target.value)
												}
												required
											>
												<option value="" disabled>
													Size
												</option>
												{COMMON_SIZES.map((size) => (
													<option key={size} value={size}>
														{size}
													</option>
												))}
												<option value="custom">Custom...</option>
											</select>
											{variant.size === "custom" && (
												<input
													type="text"
													className="input input-bordered input-sm w-full mt-1"
													placeholder="Enter size"
													onChange={(e) =>
														updateVariant(index, "size", e.target.value)
													}
												/>
											)}
										</label>
									</div>

									<div>
										<label className="label">
											<span className="label-text text-xs">Gender *</span>
											<select
												className="select select-bordered select-sm w-full mt-1"
												value={variant.gender}
												onChange={(e) =>
													updateVariant(index, "gender", e.target.value)
												}
												required
											>
												{GENDERS.map((gender) => (
													<option key={gender.value} value={gender.value}>
														{gender.label}
													</option>
												))}
											</select>
										</label>
									</div>

									<div>
										<label className="label">
											<span className="label-text text-xs">Color</span>
											<select
												className="select select-bordered select-sm w-full mt-1"
												value={variant.colorId || ""}
												onChange={(e) =>
													updateVariant(index, "colorId", e.target.value)
												}
											>
												<option value="">No specific color</option>
												{selectedColors.map((colorId) => {
													const color = metadata?.colors?.find(
														(c: { id: string; name: string }) =>
															c.id === colorId,
													);
													return color ? (
														<option key={color.id} value={color.id}>
															{color.name}
														</option>
													) : null;
												})}
											</select>
										</label>
									</div>

									<div>
										<label className="label">
											<span className="label-text text-xs">Unit Price *</span>
											<input
												type="number"
												step="0.01"
												min="0"
												className="input input-bordered input-sm w-full mt-1"
												value={variant.unitPrice}
												onChange={(e) =>
													updateVariant(index, "unitPrice", e.target.value)
												}
												required
											/>
										</label>
									</div>

									<div>
										<label className="label">
											<span className="label-text text-xs">Stock</span>
											<input
												type="number"
												min="0"
												className="input input-bordered input-sm w-full mt-1"
												value={variant.availableStock}
												onChange={(e) =>
													updateVariant(
														index,
														"availableStock",
														parseInt(e.target.value, 10) || 0,
													)
												}
											/>
										</label>
									</div>
								</div>
							</div>
						))}
					</div>

					<div className="mt-4 text-sm text-gray-600">
						<p>Total variants: {variants.length}</p>
						<p>
							This will create one product with {variants.length}{" "}
							size/color/gender combinations.
						</p>
						{skuPreview && (
							<p className="text-blue-600">
								Next available base SKU: <code>{skuPreview.nextSku}</code>
							</p>
						)}
					</div>
				</div>

				{/* Form Actions */}
				<div className="flex justify-end gap-4">
					<button
						type="button"
						className="btn btn-outline"
						onClick={() => navigate({ to: "/admin/apparel" })}
					>
						<FontAwesomeIcon icon={faTimes} className="mr-2" />
						Cancel
					</button>

					<button type="submit" className="btn btn-primary">
						<FontAwesomeIcon icon={faSave} className="mr-2" />
						{isEditing ? "Update Product" : "Create Product"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default ApparelProductForm;
