// ApparelAdminPanel.tsx

import {
	getAllApparelQueryOptions,
	useDeleteApparelProductMutation,
} from "@api/apparel/apparelQueries";
import { DataTable } from "@components/component-parts/data-table";
import {
	faCheckSquare,
	faCube,
	faEdit,
	faEye,
	faShirt,
	faTrash,
	faXmarkSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/providers/auth.provider";
import type { TProduct } from "@/types";
import AdminPageLayout from "./AdminPageLayout";
import ApparelTypesManager from "./ApparelTypesManager";

// Define the table item type for apparel products
interface ApparelTableItem extends TProduct, Record<string, unknown> {}

const ApparelAdminPanel = () => {
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(25);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedView, setSelectedView] = useState<string | null>(
		"all-apparel",
	);
	const { user } = useAuth();

	useEffect(() => {
		setPage(1);
	}, []);

	// Create filter object for apparel query
	const apparelFilters = {
		page,
		pageSize,
		searchTitle: searchTerm,
		selectedBrands: [],
		selectedCategories: [],
		selectedColors: [],
		selectedApparelTypes: [],
		selectedGenders: [],
		selectedSizes: [],
		showOutOfStock: selectedView === "out-of-stock",
		setSearchTitle: () => {}, // These are required by the interface but not used here
		setSelectedBrands: () => {},
		setSelectedCategories: () => {},
		setSelectedColors: () => {},
		setSelectedApparelTypes: () => {},
		setSelectedGenders: () => {},
		setSelectedSizes: () => {},
		setShowOutOfStock: () => {},
		isFetching: false,
		isPlaceholderData: false,
		setPage: () => {},
		hasMore: false,
		setPageAmount: () => {},
	};

	const {
		data: apparelData,
		isLoading,
		isError,
		error,
		isFetching,
		isPlaceholderData,
	} = useQuery(getAllApparelQueryOptions(apparelFilters));

	const deleteMutation = useDeleteApparelProductMutation(
		user?.token!,
		() => toast.success("Product deleted successfully"),
		(error) => toast.error(`Error deleting product: ${error.message}`),
	);
	const handleDeleteProduct = (id: string, title: string) => {
		if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
			deleteMutation.mutate(id);
		}
	};

	const columnHelper = createColumnHelper<ApparelTableItem>();

	const columns = [
		columnHelper.accessor((product) => product, {
			id: "image",
			header: "Image",
			cell: (info) => {
				const product = info.getValue();
				return (
					<div className="avatar">
						<div className="mask mask-squircle w-12 h-12">
							<img
								src={product.image}
								alt={product.title}
								onError={(e) => {
									(e.target as HTMLImageElement).src = "/placeholder.png";
								}}
							/>
						</div>
					</div>
				);
			},
			meta: { className: "text-center" },
		}),
		columnHelper.accessor("sku", {
			header: "SKU",
			cell: (info) => (
				<div className="font-mono text-sm">{info.getValue()}</div>
			),
			meta: { className: "text-center" },
		}),
		columnHelper.accessor("title", {
			header: "Title",
			cell: (info) => (
				<div>
					<div className="font-medium">{info.getValue()}</div>
					<div className="text-sm opacity-50">
						{info.row.original.apparelType?.name}
					</div>
				</div>
			),
			meta: { className: "text-left" },
		}),
		columnHelper.accessor((row) => row.category.name, {
			id: "category",
			header: "Category",
			cell: (info) => info.getValue(),
			meta: { className: "text-center" },
		}),
		columnHelper.accessor((row) => row.brand.name, {
			id: "brand",
			header: "Brand",
			cell: (info) => info.getValue(),
			meta: { className: "text-center" },
		}),
		columnHelper.accessor("variants", {
			header: "Variants",
			cell: (info) => {
				const variants = info.getValue();
				const count = variants?.length || 0;
				const sizes = new Set(variants?.map((v) => v.size) || []);
				const genders = new Set(variants?.map((v) => v.gender) || []);

				return (
					<div className="text-center">
						<div className="badge badge-primary badge-sm">{count} variants</div>
						<div className="text-xs mt-1 opacity-70">
							{sizes.size} sizes, {genders.size} styles
						</div>
					</div>
				);
			},
			meta: { className: "text-center" },
		}),
		columnHelper.accessor("casePrice", {
			header: "Case Price",
			cell: (info) => `$${parseFloat(info.getValue().toString()).toFixed(2)}`,
			meta: { className: "text-center" },
		}),
		columnHelper.accessor(
			(row) => {
				// Calculate price range from variants
				const variants = row.variants || [];
				if (variants.length === 0) return null;

				const prices = variants.map((v) => parseFloat(v.unitPrice));
				const minPrice = Math.min(...prices);
				const maxPrice = Math.max(...prices);

				return { minPrice, maxPrice };
			},
			{
				id: "unitPriceRange",
				header: "Unit Price Range",
				cell: (info) => {
					const priceRange = info.getValue();
					if (!priceRange) return "-";

					const { minPrice, maxPrice } = priceRange;
					if (minPrice === maxPrice) {
						return `$${minPrice.toFixed(2)}`;
					}
					return `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
				},
				meta: { className: "text-center" },
			},
		),
		columnHelper.accessor("inStock", {
			header: "Status",
			cell: (info) => (
				<span>
					{info.getValue() ? (
						<FontAwesomeIcon
							icon={faCheckSquare}
							className="text-success"
							size="xl"
						/>
					) : (
						<FontAwesomeIcon
							icon={faXmarkSquare}
							className="text-error"
							size="xl"
						/>
					)}
				</span>
			),
			meta: { className: "text-center" },
		}),
	] as ColumnDef<ApparelTableItem>[];

	const actions = [
		{
			icon: faEye,
			color: "info",
			to: "/apparel/$productId",
			getParams: (product: ApparelTableItem) => ({ productId: product.id }),
			tooltip: "View Product",
		},
		{
			icon: faCube,
			color: "secondary",
			to: "/admin/apparel/$productId/variants",
			getParams: (product: ApparelTableItem) => ({ productId: product.id }),
			tooltip: "Manage Variants",
		},
		{
			icon: faEdit,
			color: "warning",
			to: "/admin/apparel/$productId/edit",
			getParams: (product: ApparelTableItem) => ({ productId: product.id }),
			tooltip: "Edit Product",
		},
		{
			icon: faTrash,
			color: "error",
			onClick: (product: ApparelTableItem) =>
				handleDeleteProduct(product.id, product.title),
			tooltip: "Delete Product",
		},
	];

	const sidebarItems = [
		{ icon: faShirt, label: "All Apparel", id: "all-apparel" },
		{ icon: faCube, label: "Manage Types", id: "manage-types" },
	];

	const handleSidebarItemSelect = (itemId: string | null) => {
		setSelectedView(itemId);
	};

	return (
		<AdminPageLayout
			title="Apparel Management"
			sidebarItems={sidebarItems}
			onSidebarItemSelect={handleSidebarItemSelect}
		>
			{(selectedItem) => {
				const viewTitle = selectedItem
					? selectedItem
							.replace(/-/g, " ")
							.replace(/\b\w/g, (l) => l.toUpperCase())
					: "All Apparel";

				// Show ApparelTypesManager when "manage-types" is selected
				if (selectedView === "manage-types") {
					return <ApparelTypesManager />;
				}

				return (
					<div className="p-6">
						<DataTable<ApparelTableItem>
							title={viewTitle}
							data={apparelData?.contents as ApparelTableItem[]}
							columns={columns}
							actions={actions}
							isLoading={isLoading}
							isError={isError}
							errorMessage={
								error instanceof Error ? error.message : "Unknown error"
							}
							createButton={{
								label: "Create Apparel Product",
								to: "/admin/apparel/create",
							}}
							searchConfig={{
								placeholder: "Search apparel products...",
								searchTerm: searchTerm,
								onSearch: setSearchTerm,
							}}
							pagination={{
								currentPage: page,
								pageSize: pageSize,
								setPage: setPage,
								setPageSize: setPageSize,
								hasMore: apparelData?.hasMore || false,
								isFetching,
								isPlaceholderData,
								totalRows: apparelData?.totalItems,
								manualPagination: true,
							}}
							initialSorting={[{ id: "title", desc: false }]}
						/>

						{/* Additional Info Panel */}
						{apparelData?.contents && apparelData.contents.length > 0 && (
							<div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
								<div className="stat bg-base-200 rounded-lg">
									<div className="stat-title">Total Products</div>
									<div className="stat-value text-primary">
										{apparelData.totalItems || apparelData.contents.length}
									</div>
									<div className="stat-desc">Apparel products</div>
								</div>

								<div className="stat bg-base-200 rounded-lg">
									<div className="stat-title">Total Variants</div>
									<div className="stat-value text-secondary">
										{apparelData.contents.reduce(
											(total: number, product: TProduct) =>
												total + (product.variants?.length || 0),
											0,
										)}
									</div>
									<div className="stat-desc">Size/color combinations</div>
								</div>

								<div className="stat bg-base-200 rounded-lg">
									<div className="stat-title">In Stock</div>
									<div className="stat-value text-success">
										{
											apparelData.contents.filter(
												(p: { inStock: boolean }) => p.inStock,
											).length
										}
									</div>
									<div className="stat-desc">Available products</div>
								</div>

								<div className="stat bg-base-200 rounded-lg">
									<div className="stat-title">Apparel Types</div>
									<div className="stat-value text-accent">
										{
											new Set(
												apparelData.contents
													.map(
														(p: { apparelType: { name: string } }) =>
															p.apparelType?.name,
													)
													.filter(Boolean),
											).size
										}
									</div>
									<div className="stat-desc">Unique types</div>
								</div>
							</div>
						)}
					</div>
				);
			}}
		</AdminPageLayout>
	);
};

export default ApparelAdminPanel;
