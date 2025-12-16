import {
	getAllProductsQueryOptions,
	useDeleteProductMutation,
} from "@api/products/productsQueries";
import { DataTable } from "@components/component-parts/data-table";
import {
	faBoxes,
	faCheckSquare,
	faEdit,
	faFilter,
	faTags,
	faTrash,
	faXmarkSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "@providers/auth.provider";
import { useQuery } from "@tanstack/react-query";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { TProduct } from "@/types";
import AdminPageLayout from "./AdminPageLayout";
import MetadataManager from "./metadataManager";

// Define the table item type
interface ProductTableItem extends TProduct, Record<string, unknown> {}

const ProductsPanel = () => {
	const { user } = useAuth();
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(25);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedView, setSelectedView] = useState<string | null>(
		"all-products",
	);

	useEffect(() => {
		setPage(1);
	}, []);

	const {
		data: productsData,
		isLoading,
		isError,
		error,
		isFetching,
		isPlaceholderData,
	} = useQuery(
		getAllProductsQueryOptions({
			page,
			pageSize,
			searchTitle: searchTerm,
			isShow: false,
			inStock: selectedView === "out-of-stock" ? false : undefined,
			selectedBrands: selectedView === "by-brand" ? [] : undefined,
			selectedCategories: selectedView === "by-category" ? [] : undefined,
		}),
	);

	const deleteMutation = useDeleteProductMutation(
		user?.token ?? "",
		() => toast.success("Product deleted successfully"),
		(error) => toast.error(`Error deleting product: ${error.message}`),
	);

	const handleDeleteProduct = (id: string, title: string) => {
		if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
			deleteMutation.mutate(id);
		}
	};
	const columnHelper = createColumnHelper<ProductTableItem>();

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
			cell: (info) => info.getValue(),
			meta: { className: "text-center" },
		}),
		columnHelper.accessor("title", {
			header: "Title",
			cell: (info) => info.getValue(),
			meta: { className: "text-left font-medium" },
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
		columnHelper.accessor("casePrice", {
			header: "Price",
			cell: (info) => `$${parseFloat(info.getValue().toString()).toFixed(2)}`,
			meta: { className: "text-center" },
		}),
		columnHelper.accessor("inStock", {
			header: "Status",
			cell: (info) => (
				<span
					className={`${
						info.getValue()
							? " group-hover:ring-2 group-hover:ring-white group-hover:ring-opacity-70"
							: "  group-hover:ring-2 group-hover:ring-white group-hover:ring-opacity-70"
					}`}
				>
					{info.getValue() ? (
						<FontAwesomeIcon
							icon={faCheckSquare}
							className="text-success"
							size="xl"
						/>
					) : (
						<FontAwesomeIcon
							icon={faXmarkSquare}
							className="text-error "
							size="xl"
						/>
					)}
				</span>
			),
			meta: { className: "text-center" },
		}),
	] as ColumnDef<ProductTableItem>[];

	const actions = [
		{
			icon: faEdit,
			color: "warning",
			to: "/admin/products/$productId/edit",
			getParams: (product: ProductTableItem) => ({ productId: product.id }),
		},
		{
			icon: faTrash,
			color: "error",
			onClick: (product: ProductTableItem) =>
				handleDeleteProduct(product.id, product.title),
			isDisabled: () => deleteMutation.isPending,
		},
	];

	const sidebarItems = [
		{ icon: faBoxes, label: "All Products", id: "all-products" },
		{ icon: faFilter, label: "Out of Stock", id: "out-of-stock" },
		{ icon: faTags, label: "Manage Metadata", id: "manage-metadata" },
	];

	const handleSidebarItemSelect = (itemId: string | null) => {
		setSelectedView(itemId);
	};

	return (
		<AdminPageLayout
			title="Product Management"
			sidebarItems={sidebarItems}
			onSidebarItemSelect={handleSidebarItemSelect}
		>
			{(selectedItem) => {
				const viewTitle = selectedItem
					? selectedItem
							.replace(/-/g, " ")
							.replace(/\b\w/g, (l) => l.toUpperCase())
					: "All Products";
				if (selectedView === "manage-metadata") {
					return <MetadataManager />;
				}

				return (
					<div className="p-6">
						<DataTable<ProductTableItem>
							title={viewTitle}
							data={productsData?.contents as ProductTableItem[]}
							columns={columns}
							actions={actions}
							isLoading={isLoading}
							isError={isError}
							errorMessage={
								error instanceof Error ? error.message : "Unknown error"
							}
							createButton={{
								label: "Create Product",
								to: "/admin/products/create",
							}}
							searchConfig={{
								placeholder: "Search products...",
								searchTerm: searchTerm,
								onSearch: setSearchTerm,
							}}
							pagination={{
								currentPage: page,
								pageSize: pageSize,
								setPage: setPage,
								setPageSize: setPageSize,
								hasMore: productsData?.hasMore || false,
								isFetching,
								isPlaceholderData,
								totalRows: productsData?.totalItems,
								manualPagination: true,
							}}
							initialSorting={[{ id: "title", desc: false }]}
						/>
					</div>
				);
			}}
		</AdminPageLayout>
	);
};

export default ProductsPanel;
