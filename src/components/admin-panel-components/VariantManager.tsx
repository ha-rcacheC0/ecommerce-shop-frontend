/* eslint-disable @typescript-eslint/no-explicit-any */
// VariantManager.tsx - Component for managing variants of an apparel product

import { getApparelByIdQueryOptions } from "@api/apparel/apparelQueries";
import {
	faArrowLeft,
	faCheck,
	faCopy,
	faEdit,
	faExclamationTriangle,
	faPlus,
	faSpinner,
	faTimes,
	faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type React from "react";
import { useState } from "react";
import type { ProductVariant } from "@/types";
import { logger } from "@/utils/logger";

interface VariantManagerProps {
	productId: string;
}

interface EditingVariant extends ProductVariant {
	isEditing?: boolean;
	isNew?: boolean;
	originalData?: ProductVariant;
}

const GENDERS = [
	{ value: "MALE", label: "Men's" },
	{ value: "FEMALE", label: "Women's" },
	{ value: "UNISEX", label: "Unisex" },
] as const;

const COMMON_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

const VariantManager: React.FC<VariantManagerProps> = ({ productId }) => {
	const navigate = useNavigate();
	const [variants, setVariants] = useState<EditingVariant[]>([]);
	const [isSaving, setIsSaving] = useState(false);

	// Get product data with variants
	const {
		data: product,
		isLoading,
		isError,
		error,
	} = useQuery(getApparelByIdQueryOptions(productId));

	// Start editing a variant
	const startEditing = (variantId: string) => {
		setVariants((prev) =>
			prev.map((variant) =>
				variant.id === variantId
					? { ...variant, isEditing: true, originalData: { ...variant } }
					: { ...variant, isEditing: false },
			),
		);
	};

	// Cancel editing
	const cancelEditing = (variantId: string) => {
		setVariants(
			(prev) =>
				prev
					.map((variant) => {
						if (variant.id === variantId) {
							if (variant.isNew) {
								return null; // Remove new variants when cancelled
							}
							return {
								...(variant.originalData ?? variant),
								isEditing: false,
								originalData: undefined,
							};
						}
						return variant;
					})
					.filter(Boolean) as EditingVariant[],
		);
	};

	// Update variant data
	const updateVariant = (
		variantId: string,
		field: keyof ProductVariant,
		value: ProductVariant[keyof ProductVariant],
	) => {
		setVariants((prev) =>
			prev.map((variant) =>
				variant.id === variantId ? { ...variant, [field]: value } : variant,
			),
		);
	};

	// Save variant
	const saveVariant = async (variantId: string) => {
		const variant = variants.find((v) => v.id === variantId);
		if (!variant) return;

		try {
			setIsSaving(true);

			// TODO: Implement actual API calls
			if (variant.isNew) {
				logger.debug({ variantId, sku: variant.sku }, "Creating new variant");
				// await createVariant(variant);
			} else {
				logger.debug({ variantId, sku: variant.sku }, "Updating variant");
				// await updateVariant(variantId, variant);
			}

			// Update local state
			setVariants((prev) =>
				prev.map((v) =>
					v.id === variantId
						? { ...v, isEditing: false, isNew: false, originalData: undefined }
						: v,
				),
			);
		} catch (error) {
			console.error("Error saving variant:", error);
		} finally {
			setIsSaving(false);
		}
	};

	// Delete variant
	const deleteVariant = async (variantId: string) => {
		const variant = variants.find((v) => v.id === variantId);
		if (!variant) return;

		if (
			!confirm(
				`Are you sure you want to delete the ${variant.size} ${variant.gender.toLowerCase()} variant?`,
			)
		) {
			return;
		}

		try {
			if (!variant.isNew) {
				// TODO: Implement actual API call
				logger.debug({ variantId, sku: variant.sku }, "Deleting variant");
				// await deleteVariant(variantId);
			}

			setVariants((prev) => prev.filter((v) => v.id !== variantId));
		} catch (error) {
			console.error("Error deleting variant:", error);
		}
	};

	// Add new variant
	const addNewVariant = () => {
		const newVariant: EditingVariant = {
			id: `temp-${Date.now()}`,
			sku: `${product?.sku}-NEW`,
			productId: productId,
			size: "M",
			gender: "UNISEX",
			colorId: null,
			color: null,
			unitPrice: "0.00",
			availableStock: 999,
			additionalSku: null,
			isActive: true,
			isEditing: true,
			isNew: true,
		};

		setVariants((prev) => [...prev, newVariant]);
	};

	// Duplicate variant
	const duplicateVariant = (variantId: string) => {
		const variant = variants.find((v) => v.id === variantId);
		if (!variant) return;

		const duplicatedVariant: EditingVariant = {
			...variant,
			id: `temp-${Date.now()}`,
			sku: `${product?.sku}-DUP`,
			isEditing: true,
			isNew: true,
			originalData: undefined,
		};

		setVariants((prev) => [...prev, duplicatedVariant]);
	};

	// Bulk operations
	const applyPriceToAll = () => {
		const price = prompt("Enter price to apply to all variants:");
		if (!price || Number.isNaN(parseFloat(price))) return;

		setVariants((prev) =>
			prev.map((variant) => ({
				...variant,
				unitPrice: parseFloat(price).toFixed(2),
			})),
		);
	};

	const applyStockToAll = () => {
		const stock = prompt("Enter stock level to apply to all variants:");
		if (!stock || Number.isNaN(parseInt(stock, 10))) return;

		setVariants((prev) =>
			prev.map((variant) => ({
				...variant,
				availableStock: parseInt(stock, 10),
			})),
		);
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center p-8">
				<FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
				<span>Loading variants...</span>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="alert alert-error">
				<FontAwesomeIcon icon={faExclamationTriangle} />
				<span>Error loading product: {error?.message}</span>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-4">
					<button
						onClick={() => navigate({ to: "/admin/apparel" })}
						className="btn btn-ghost btn-sm"
					>
						<FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
						Back to Apparel
					</button>
					<div>
						<h1 className="text-2xl font-bold">{product?.title}</h1>
						<p className="text-sm opacity-70">Manage product variants</p>
					</div>
				</div>

				<div className="flex gap-2">
					<button onClick={applyPriceToAll} className="btn btn-outline btn-sm">
						Set All Prices
					</button>
					<button onClick={applyStockToAll} className="btn btn-outline btn-sm">
						Set All Stock
					</button>
					<button onClick={addNewVariant} className="btn btn-primary btn-sm">
						<FontAwesomeIcon icon={faPlus} className="mr-2" />
						Add Variant
					</button>
				</div>
			</div>

			{/* Product Info */}
			<div className="bg-base-200 p-4 rounded-lg mb-6">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div>
						<span className="text-sm opacity-70">Base SKU:</span>
						<p className="font-mono">{product?.sku}</p>
					</div>
					<div>
						<span className="text-sm opacity-70">Case Price:</span>
						<p className="font-bold">
							${parseFloat(product?.casePrice || "0").toFixed(2)}
						</p>
					</div>
					<div>
						<span className="text-sm opacity-70">Type:</span>
						<p>{product?.apparelType?.name}</p>
					</div>
					<div>
						<span className="text-sm opacity-70">Total Variants:</span>
						<p className="font-bold">{variants.length}</p>
					</div>
				</div>
			</div>

			{/* Variants List */}
			<div className="space-y-4">
				{variants.map((variant) => (
					<div
						key={variant.id}
						className={`bg-base-100 border-2 rounded-lg p-4 transition-all ${
							variant.isEditing ? "border-primary" : "border-base-300"
						}`}
					>
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-4">
								<h3 className="font-medium">
									{variant.size} -{" "}
									{GENDERS.find((g) => g.value === variant.gender)?.label}
									{variant.color && ` - ${variant.color.name}`}
								</h3>
								{variant.isNew && (
									<span className="badge badge-primary badge-sm">New</span>
								)}
								{!variant.isActive && (
									<span className="badge badge-error badge-sm">Inactive</span>
								)}
							</div>

							{!variant.isEditing ? (
								<div className="flex gap-2">
									<button
										onClick={() => duplicateVariant(variant.id)}
										className="btn btn-ghost btn-sm"
										title="Duplicate"
									>
										<FontAwesomeIcon icon={faCopy} />
									</button>
									<button
										onClick={() => startEditing(variant.id)}
										className="btn btn-ghost btn-sm"
										title="Edit"
									>
										<FontAwesomeIcon icon={faEdit} />
									</button>
									<button
										onClick={() => deleteVariant(variant.id)}
										className="btn btn-ghost btn-sm text-error"
										title="Delete"
									>
										<FontAwesomeIcon icon={faTrash} />
									</button>
								</div>
							) : (
								<div className="flex gap-2">
									<button
										onClick={() => saveVariant(variant.id)}
										className="btn btn-primary btn-sm"
										disabled={isSaving}
										title="Save"
									>
										<FontAwesomeIcon
											icon={isSaving ? faSpinner : faCheck}
											spin={isSaving}
										/>
									</button>
									<button
										onClick={() => cancelEditing(variant.id)}
										className="btn btn-ghost btn-sm"
										title="Cancel"
									>
										<FontAwesomeIcon icon={faTimes} />
									</button>
								</div>
							)}
						</div>

						{variant.isEditing ? (
							<div className="grid grid-cols-1 md:grid-cols-6 gap-4">
								<div>
									<label className="label">
										<span className="label-text text-xs">Size</span>
									</label>
									<select
										className="select select-bordered select-sm w-full"
										value={variant.size}
										onChange={(e) =>
											updateVariant(variant.id, "size", e.target.value)
										}
									>
										{COMMON_SIZES.map((size) => (
											<option key={size} value={size}>
												{size}
											</option>
										))}
									</select>
								</div>

								<div>
									<label className="label">
										<span className="label-text text-xs">Gender</span>
									</label>
									<select
										className="select select-bordered select-sm w-full"
										value={variant.gender}
										onChange={(e) =>
											updateVariant(variant.id, "gender", e.target.value)
										}
									>
										{GENDERS.map((gender) => (
											<option key={gender.value} value={gender.value}>
												{gender.label}
											</option>
										))}
									</select>
								</div>

								<div>
									<label className="label">
										<span className="label-text text-xs">Unit Price</span>
									</label>
									<input
										type="number"
										step="0.01"
										className="input input-bordered input-sm w-full"
										value={variant.unitPrice}
										onChange={(e) =>
											updateVariant(variant.id, "unitPrice", e.target.value)
										}
									/>
								</div>

								<div>
									<label className="label">
										<span className="label-text text-xs">Stock</span>
									</label>
									<input
										type="number"
										className="input input-bordered input-sm w-full"
										value={variant.availableStock}
										onChange={(e) =>
											updateVariant(
												variant.id,
												"availableStock",
												parseInt(e.target.value, 10) || 0,
											)
										}
									/>
								</div>

								<div>
									<label className="label">
										<span className="label-text text-xs">Status</span>
									</label>
									<select
										className="select select-bordered select-sm w-full"
										value={variant.isActive ? "active" : "inactive"}
										onChange={(e) =>
											updateVariant(
												variant.id,
												"isActive",
												e.target.value === "active",
											)
										}
									>
										<option value="active">Active</option>
										<option value="inactive">Inactive</option>
									</select>
								</div>
							</div>
						) : (
							<div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
								<div>
									<span className="opacity-70">SKU:</span>
									<p className="font-mono">{variant.sku}</p>
								</div>
								<div>
									<span className="opacity-70">Unit Price:</span>
									<p className="font-bold">
										${parseFloat(variant.unitPrice).toFixed(2)}
									</p>
								</div>
								<div>
									<span className="opacity-70">Stock:</span>
									<p
										className={
											variant.availableStock > 0 ? "text-success" : "text-error"
										}
									>
										{variant.availableStock} units
									</p>
								</div>
								<div>
									<span className="opacity-70">Color:</span>
									<p>{variant.color?.name || "No specific color"}</p>
								</div>
								<div>
									<span className="opacity-70">Status:</span>
									<span
										className={`badge badge-sm ${variant.isActive ? "badge-success" : "badge-error"}`}
									>
										{variant.isActive ? "Active" : "Inactive"}
									</span>
								</div>
							</div>
						)}
					</div>
				))}

				{variants.length === 0 && (
					<div className="text-center py-8">
						<p className="text-lg opacity-70 mb-4">No variants found</p>
						<button onClick={addNewVariant} className="btn btn-primary">
							<FontAwesomeIcon icon={faPlus} className="mr-2" />
							Add First Variant
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default VariantManager;
