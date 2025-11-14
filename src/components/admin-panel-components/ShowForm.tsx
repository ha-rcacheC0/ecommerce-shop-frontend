// src/components/ShowForm.tsx

import { getAllProductsQueryOptions } from "@api/products/productsQueries";
import {
	getAllShowTypesQueryOptions,
	getShowByIdQueryOptions,
	useCreateShowMutation,
	useUpdateShowMutation,
} from "@api/shows/showsQueries";
import {
	faBox,
	faBoxes,
	faPlus,
	faSave,
	faSearch,
	faSpinner,
	faTimes,
	faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "@providers/auth.provider";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getProductMetadataQueryOptions } from "@/api/metadata/metadataQueries";
import type { CreateShowProductData, TProduct } from "@/types";

interface ShowFormProps {
	showId?: string;
	isEditing?: boolean;
}

const ShowForm: React.FC<ShowFormProps> = ({ showId, isEditing = false }) => {
	const navigate = useNavigate();
	const { user } = useAuth();

	// Form state
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");
	const [image, setImage] = useState("");
	const [videoURL, setVideoURL] = useState("");
	const [inStock, setInStock] = useState(true);
	const [showTypeId, setShowTypeId] = useState("");
	const [selectedProducts, setSelectedProducts] = useState<
		CreateShowProductData[]
	>([]);
	const [selectedBrandId, setSelectedBrandId] = useState("");
	const [selectedCategoryId, setSelectedCategoryId] = useState("");

	// Product selection state
	const [isSelectingProduct, setIsSelectingProduct] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [productPage, setProductPage] = useState(1);

	// Queries
	const { data: showTypes, isLoading: typesLoading } = useQuery(
		getAllShowTypesQueryOptions(),
	);
	const { data: metadata, isLoading: metadataLoading } = useQuery(
		getProductMetadataQueryOptions(),
	);

	// Get products for selection
	const { data: productsData, isLoading: productsLoading } = useQuery(
		getAllProductsQueryOptions({
			page: productPage,
			pageSize: 10,
			searchTitle: searchTerm,
			isShow: false, // Only regular products, not shows
		}),
	);

	// Get show data if editing
	const { data: showData, isLoading: showLoading } = useQuery({
		...getShowByIdQueryOptions(showId || ""),
		enabled: isEditing && !!showId,
	});

	// Mutations
	const createShowMutation = useCreateShowMutation(
		user?.token!,
		() => {
			toast.success("Show created successfully!");
			navigate({ to: "/admin/shows" });
		},
		(error: { message: string }) => {
			toast.error(`Error creating show: ${error.message}`);
		},
	);

	const updateShowMutation = useUpdateShowMutation(
		showId || "",
		user?.token!,
		() => {
			toast.success("Show updated successfully!");
			navigate({ to: "/admin/shows" });
		},
		(error: { message: string }) => {
			toast.error(`Error updating show: ${error.message}`);
		},
	);

	// Initialize form with show data if editing
	useEffect(() => {
		if (isEditing && showData) {
			setTitle(showData.title);
			setDescription(showData.description || "");
			setPrice(parseFloat(showData.casePrice.toString()).toFixed(2)); // Use casePrice for the price
			setImage(showData.image);
			setVideoURL(showData.videoURL || "");
			setInStock(showData.inStock!);
			setShowTypeId(showData.showTypeId || "");
			setSelectedBrandId(showData.brand?.id || "");
			setSelectedCategoryId(showData.category?.id || "");

			// Set show products
			if (showData.showProducts) {
				setSelectedProducts(
					showData.showProducts.map((sp) => ({
						productId: sp.product.id,
						quantity: sp.quantity,
						notes: sp.notes || "",
						isUnit: sp.isUnit,
					})),
				);
			}
		}
	}, [isEditing, showData]);

	// Handle adding a product to the show
	const handleAddProduct = (product: TProduct, isUnit: boolean) => {
		// Check if product is already in the show
		const existingProduct = selectedProducts.find(
			(p) => p.productId === product.id && p.isUnit === isUnit,
		);

		if (existingProduct) {
			toast.warning(
				`"${product.title}" is already in the show as a ${
					isUnit ? "unit" : "case"
				}`,
			);
			return;
		}

		setSelectedProducts([
			...selectedProducts,
			{
				productId: product.id,
				quantity: 1,
				isUnit,
				notes: "",
			},
		]);
		setIsSelectingProduct(false);
		setSearchTerm("");
	};

	// Handle removing a product from the show
	const handleRemoveProduct = (productId: string, isUnit: boolean) => {
		setSelectedProducts(
			selectedProducts.filter(
				(p) => !(p.productId === productId && p.isUnit === isUnit),
			),
		);
	};

	// Handle updating product quantity
	const handleUpdateQuantity = (
		productId: string,
		isUnit: boolean,
		quantity: number,
	) => {
		setSelectedProducts(
			selectedProducts.map((p) =>
				p.productId === productId && p.isUnit === isUnit
					? { ...p, quantity: Math.max(1, quantity) }
					: p,
			),
		);
	};

	// Handle updating product notes
	const handleUpdateNotes = (
		productId: string,
		isUnit: boolean,
		notes: string,
	) => {
		setSelectedProducts(
			selectedProducts.map((p) =>
				p.productId === productId && p.isUnit === isUnit ? { ...p, notes } : p,
			),
		);
	};

	// Handle form submission
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!title) {
			toast.error("Title is required");
			return;
		}

		if (!showTypeId) {
			toast.error("Show Type is required");
			return;
		}

		if (!price || Number.isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
			toast.error("Valid price is required");
			return;
		}

		if (selectedProducts.length === 0) {
			toast.error("At least one product is required");
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

		const showData = {
			title,
			description: description || undefined,
			casePrice: parseFloat(price),
			image: image || undefined,
			videoURL: videoURL || undefined,
			inStock,
			showTypeId,
			brandId: selectedBrandId,
			categoryId: selectedCategoryId,
			products: selectedProducts,
		};

		if (isEditing && showId) {
			updateShowMutation.mutate(showData);
		} else {
			createShowMutation.mutate(showData);
		}
	};

	const isLoading =
		typesLoading || metadataLoading || (isEditing && showLoading);
	const isSaving = createShowMutation.isPending || updateShowMutation.isPending;

	if (isLoading) {
		return (
			<div className="flex justify-center items-center p-8">
				<FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
				<span>Loading...</span>
			</div>
		);
	}

	// Find product details by ID
	const getProductDetails = (productId: string) => {
		return (
			productsData?.contents.find((p: TProduct) => p.id === productId) ||
			showData?.showProducts?.find(
				(sp: { product: { id: string } }) => sp.product.id === productId,
			)?.product
		);
	};

	return (
		<div className="container mx-auto p-6 bg-base-100 rounded-lg shadow-lg">
			<h1 className="text-2xl font-bold mb-6">
				{isEditing ? `Edit Show: ${showData?.title}` : "Create New Show"}
			</h1>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Basic Show Information */}
				<div className="bg-base-200 p-4 rounded-lg">
					<h2 className="text-lg font-semibold mb-4">Basic Information</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="floating-label">
								<span className="label-text">Title *</span>
								<input
									type="text"
									className="input input-bordered w-full"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									required
								/>
							</label>
						</div>

						<div>
							<label className="floating-label">
								<span className="label-text">Show Type *</span>
								<select
									className="select select-bordered w-full"
									value={showTypeId}
									onChange={(e) => setShowTypeId(e.target.value)}
									required
								>
									<option value="" disabled>
										Select Show Type
									</option>
									{showTypes?.map((type: { id: string; name: string }) => (
										<option key={type.id} value={type.id}>
											{type.name}
										</option>
									))}
								</select>
							</label>
						</div>

						<div>
							<label className="floating-label">
								<span className="label-text">Price *</span>
								<input
									type="number"
									step="0.01"
									min="0"
									className="input input-bordered w-full"
									value={price}
									onChange={(e) => setPrice(e.target.value)}
									required
								/>
							</label>
						</div>

						<div className="flex gap-2 justify-between">
							<label className="floating-label">
								<span className="label-text">Brand *</span>
							</label>
							<select
								className="select select-bordered w-full"
								value={selectedBrandId}
								onChange={(e) => setSelectedBrandId(e.target.value)}
								required
							>
								<option value="" disabled>
									Select Brand
								</option>
								{metadata?.brands?.map(
									(brand: { id: string; name: string }) => (
										<option key={brand.id} value={brand.id}>
											{brand.name}
										</option>
									),
								)}
							</select>

							<label className="floating-label">
								<span className="label-text">Category *</span>
								<select
									className="select select-bordered w-full"
									value={selectedCategoryId}
									onChange={(e) => setSelectedCategoryId(e.target.value)}
									required
								>
									<option value="" disabled>
										Select Category
									</option>
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
							<fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4">
								<legend className="fieldset-legend">In Stock</legend>
								<label className="label">
									<input type="checkbox" defaultChecked className="checkbox" />
									Available for purchase
								</label>
							</fieldset>
						</div>
						<label className="floating-label">
							<span className="label-text">Description</span>
							<textarea
								className="textarea textarea-bordered h-24"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							></textarea>
						</label>
					</div>
				</div>

				{/* Media Section */}
				<div className="bg-base-200 p-4 rounded-lg">
					<h2 className="text-lg font-semibold mb-4">Media</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="floating-label">
								<span className="label-text">Image URL</span>
								<input
									type="text"
									className="input input-bordered"
									value={image}
									onChange={(e) => setImage(e.target.value)}
									placeholder="https://example.com/image.jpg"
								/>
							</label>
						</div>
						<div>
							<label className="floating-label">
								<span className="label-text">Video URL</span>
								<input
									type="text"
									className="input input-bordered"
									value={videoURL}
									onChange={(e) => setVideoURL(e.target.value)}
									placeholder="https://youtube.com/watch?v=..."
								/>
							</label>
						</div>
						{image && (
							<div className="w-40 h-40 rounded-md overflow-hidden">
								<img
									src={image}
									alt="Show Preview"
									className="w-full h-full object-cover"
									onError={(e) => {
										(e.target as HTMLImageElement).src = "";
									}}
								/>
							</div>
						)}

						{videoURL && (
							<div className="mt-4 flex justify-center">
								<div className="w-40 h-40 rounded-md overflow-hidden">
									<iframe
										src={videoURL}
										className="w-full h-full object-cover"
										onError={(e) => {
											(e.target as HTMLImageElement).src = "/placeholder.png";
										}}
									/>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Products Section */}
				<div className="bg-base-200 p-4 rounded-lg">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-lg font-semibold">Products in this Show</h2>
						<button
							type="button"
							className="btn btn-primary btn-sm"
							onClick={() => setIsSelectingProduct(true)}
						>
							<FontAwesomeIcon icon={faPlus} className="mr-2" />
							Add Product
						</button>
					</div>

					{/* Product Selection Modal */}
					{isSelectingProduct && (
						<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
							<div className="bg-base-100 p-6 rounded-lg w-full max-w-3xl">
								<div className="flex justify-between items-center mb-4">
									<h3 className="text-lg font-semibold">Select Product</h3>
									<button
										type="button"
										className="btn btn-sm btn-circle"
										onClick={() => setIsSelectingProduct(false)}
									>
										<FontAwesomeIcon icon={faTimes} />
									</button>
								</div>

								<div className="mb-4">
									<div className="input-group">
										<input
											type="text"
											placeholder="Search products..."
											className="input input-bordered w-full"
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
										/>
										<button className="btn btn-square">
											<FontAwesomeIcon icon={faSearch} />
										</button>
									</div>
								</div>

								<div className="overflow-y-auto max-h-96">
									{productsLoading ? (
										<div className="text-center py-4">
											<FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
											Loading products...
										</div>
									) : productsData?.contents.length === 0 ? (
										<div className="text-center py-4">No products found</div>
									) : (
										<table className="table w-full">
											<thead>
												<tr>
													<th>Product</th>
													<th>SKU</th>
													<th>Price</th>
													<th>Actions</th>
												</tr>
											</thead>
											<tbody>
												{productsData?.contents.map((product: TProduct) => (
													<tr key={product.id} className="hover">
														<td>
															<div className="flex items-center space-x-3">
																<div className="avatar">
																	<div className="mask mask-squircle w-12 h-12">
																		<img
																			src={product.image}
																			alt={product.title}
																			onError={(e) => {
																				(e.target as HTMLImageElement).src =
																					"/placeholder.png";
																			}}
																		/>
																	</div>
																</div>
																<div>
																	<div className="font-bold">
																		{product.title}
																	</div>
																	<div className="text-sm opacity-50">
																		{product.brand?.name} -{" "}
																		{product.category?.name}
																	</div>
																</div>
															</div>
														</td>
														<td>{product.sku}</td>
														<td>
															$
															{parseFloat(product.casePrice.toString()).toFixed(
																2,
															)}
														</td>
														<td className="flex flex-col gap-2">
															{/* Case button */}
															<button
																type="button"
																className="btn btn-primary btn-sm"
																onClick={() => handleAddProduct(product, false)}
																disabled={selectedProducts.some(
																	(p) =>
																		p.productId === product.id && !p.isUnit,
																)}
															>
																{selectedProducts.some(
																	(p) =>
																		p.productId === product.id && !p.isUnit,
																) ? (
																	"Added as Case"
																) : (
																	<>
																		<FontAwesomeIcon
																			icon={faBoxes}
																			className="mr-1"
																		/>
																		Add as Case
																	</>
																)}
															</button>

															{/* Unit button - only show if the product is case breakable */}
															{product.isCaseBreakable &&
																product.unitProduct && (
																	<button
																		type="button"
																		className="btn btn-secondary btn-sm"
																		onClick={() =>
																			handleAddProduct(product, true)
																		}
																		disabled={selectedProducts.some(
																			(p) =>
																				p.productId === product.id && p.isUnit,
																		)}
																	>
																		{selectedProducts.some(
																			(p) =>
																				p.productId === product.id && p.isUnit,
																		) ? (
																			"Added as Unit"
																		) : (
																			<>
																				<FontAwesomeIcon
																					icon={faBox}
																					className="mr-1"
																				/>
																				Add as Unit
																			</>
																		)}
																	</button>
																)}
														</td>
													</tr>
												))}
											</tbody>
										</table>
									)}
								</div>

								<div className="flex justify-between items-center mt-4">
									<button
										type="button"
										className="btn btn-sm"
										onClick={() => setProductPage(Math.max(1, productPage - 1))}
										disabled={productPage === 1}
									>
										Previous
									</button>
									<span>Page {productPage}</span>
									<button
										type="button"
										className="btn btn-sm"
										onClick={() => setProductPage(productPage + 1)}
										disabled={!productsData?.hasMore}
									>
										Next
									</button>
								</div>
							</div>
						</div>
					)}

					{/* Selected Products */}
					{selectedProducts.length > 0 ? (
						<table className="table w-full">
							<thead>
								<tr>
									<th>Product</th>
									<th>Type</th>
									<th>Quantity</th>
									<th>Notes</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{selectedProducts.map((selectedProduct, index) => {
									// Find the product details
									const product = getProductDetails(selectedProduct.productId);

									if (!product) return null;

									return (
										<tr
											key={`${selectedProduct.productId}-${selectedProduct.isUnit}-${index}`}
										>
											<td>
												<div className="flex items-center space-x-3">
													<div className="avatar">
														<div className="mask mask-squircle w-12 h-12">
															<img
																src={product.image}
																alt={product.title}
																onError={(e) => {
																	(e.target as HTMLImageElement).src =
																		"/placeholder.png";
																}}
															/>
														</div>
													</div>
													<div>
														<div className="font-bold">{product.title}</div>
														<div className="text-sm opacity-50">
															{product.brand?.name} - SKU: {product.sku}
														</div>
													</div>
												</div>
											</td>
											<td>
												<span
													className={`badge ${selectedProduct.isUnit ? "badge-secondary" : "badge-primary"}`}
												>
													{selectedProduct.isUnit ? "Unit" : "Case"}
												</span>
											</td>
											<td>
												<input
													type="number"
													min="1"
													className="input input-bordered w-20"
													value={selectedProduct.quantity}
													onChange={(e) =>
														handleUpdateQuantity(
															selectedProduct.productId,
															selectedProduct.isUnit,
															parseInt(e.target.value, 10) || 1,
														)
													}
												/>
											</td>
											<td>
												<input
													type="text"
													className="input input-bordered w-full"
													value={selectedProduct.notes || ""}
													onChange={(e) =>
														handleUpdateNotes(
															selectedProduct.productId,
															selectedProduct.isUnit,
															e.target.value,
														)
													}
													placeholder="Optional notes"
												/>
											</td>
											<td>
												<button
													type="button"
													className="btn btn-error btn-sm"
													onClick={() =>
														handleRemoveProduct(
															selectedProduct.productId,
															selectedProduct.isUnit,
														)
													}
												>
													<FontAwesomeIcon icon={faTrash} />
												</button>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					) : (
						<div className="text-center py-8 border border-dashed border-gray-300 rounded-md">
							<p className="text-gray-500">
								No products added to this show yet.
							</p>
							<p className="text-gray-500 text-sm mt-1">
								Click "Add Product" to get started.
							</p>
						</div>
					)}
				</div>

				{/* Form Actions */}
				<div className="flex justify-end space-x-4">
					<button
						type="button"
						className="btn btn-outline"
						onClick={() => navigate({ to: "/admin/shows" })}
						disabled={isSaving}
					>
						<FontAwesomeIcon icon={faTimes} className="mr-2" />
						Cancel
					</button>
					<button type="submit" className="btn btn-primary" disabled={isSaving}>
						{isSaving ? (
							<>
								<FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
								{isEditing ? "Updating..." : "Creating..."}
							</>
						) : (
							<>
								<FontAwesomeIcon icon={faSave} className="mr-2" />
								{isEditing ? "Update" : "Create"}
							</>
						)}
					</button>
				</div>
			</form>
		</div>
	);
};

export default ShowForm;
