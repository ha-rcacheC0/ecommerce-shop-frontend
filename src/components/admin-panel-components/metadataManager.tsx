// MetadataManager.tsx - Server-side pagination like ProductsPanel

import {
	getMetadataWithPaginationQueryOptions,
	useCreateBrandMutation,
	useCreateCategoryMutation,
	useCreateColorMutation,
	useCreateEffectMutation,
	useDeleteBrandMutation,
	useDeleteCategoryMutation,
	useDeleteColorMutation,
	useDeleteEffectMutation,
	useUpdateBrandMutation,
	useUpdateCategoryMutation,
	useUpdateColorMutation,
	useUpdateEffectMutation,
} from "@api/metadata/metadataQueries";
import { DataTable } from "@components/component-parts/data-table";
import {
	faBuilding,
	faEdit,
	faLayerGroup,
	faPalette,
	faPlus,
	faSave,
	faSpinner,
	faStar,
	faTimes,
	faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "@providers/auth.provider";
import { useQuery } from "@tanstack/react-query";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoadingScreen from "../LoadingScreen";

interface MetadataItem {
	id: string;
	name: string;
	productCount?: number;
}

interface MetadataItemTableItem extends MetadataItem, Record<string, unknown> {}

const MetadataManager = () => {
	const { user } = useAuth();
	const [activeTab, setActiveTab] = useState<
		"brands" | "categories" | "colors" | "effects"
	>("brands");

	// Pagination and search state (like ProductsPanel)
	const [page, setPage] = useState(1);

	const [searchTerm, setSearchTerm] = useState("");

	// Form state
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editValue, setEditValue] = useState("");
	const [isCreating, setIsCreating] = useState(false);
	const [newValue, setNewValue] = useState("");

	// Reset page when tab or search changes (like ProductsPanel)
	useEffect(() => {
		setPage(1);
	}, []);

	// Fetch paginated metadata for current tab
	const {
		data: metadataData,
		isLoading,
		isError,
		error,
	} = useQuery(
		getMetadataWithPaginationQueryOptions({
			page,
			pageSize: 25,
			searchTitle: searchTerm,
			type: activeTab,
		}),
	);

	// Initialize mutations for all types
	const createBrandMutation = useCreateBrandMutation(
		user?.token ?? "",
		() => {
			toast.success("Brand created successfully!");
			setIsCreating(false);
			setNewValue("");
		},
		(error) => toast.error(`Error creating brand: ${error.message}`),
	);

	const updateBrandMutation = useUpdateBrandMutation(
		user?.token ?? "",
		() => {
			toast.success("Brand updated successfully!");
			setEditingId(null);
			setEditValue("");
		},
		(error) => toast.error(`Error updating brand: ${error.message}`),
	);

	const deleteBrandMutation = useDeleteBrandMutation(
		user?.token ?? "",
		() => toast.success("Brand deleted successfully!"),
		(error) => toast.error(`Error deleting brand: ${error.message}`),
	);

	const createCategoryMutation = useCreateCategoryMutation(
		user?.token ?? "",
		() => {
			toast.success("Category created successfully!");
			setIsCreating(false);
			setNewValue("");
		},
		(error) => toast.error(`Error creating category: ${error.message}`),
	);

	const updateCategoryMutation = useUpdateCategoryMutation(
		user?.token ?? "",
		() => {
			toast.success("Category updated successfully!");
			setEditingId(null);
			setEditValue("");
		},
		(error) => toast.error(`Error updating category: ${error.message}`),
	);

	const deleteCategoryMutation = useDeleteCategoryMutation(
		user?.token ?? "",
		() => toast.success("Category deleted successfully!"),
		(error) => toast.error(`Error deleting category: ${error.message}`),
	);

	const createColorMutation = useCreateColorMutation(
		user?.token ?? "",
		() => {
			toast.success("Color created successfully!");
			setIsCreating(false);
			setNewValue("");
		},
		(error) => toast.error(`Error creating color: ${error.message}`),
	);

	const updateColorMutation = useUpdateColorMutation(
		user?.token ?? "",
		() => {
			toast.success("Color updated successfully!");
			setEditingId(null);
			setEditValue("");
		},
		(error) => toast.error(`Error updating color: ${error.message}`),
	);

	const deleteColorMutation = useDeleteColorMutation(
		user?.token ?? "",
		() => toast.success("Color deleted successfully!"),
		(error) => toast.error(`Error deleting color: ${error.message}`),
	);

	const createEffectMutation = useCreateEffectMutation(
		user?.token ?? "",
		() => {
			toast.success("Effect created successfully!");
			setIsCreating(false);
			setNewValue("");
		},
		(error) => toast.error(`Error creating effect: ${error.message}`),
	);

	const updateEffectMutation = useUpdateEffectMutation(
		user?.token ?? "",
		() => {
			toast.success("Effect updated successfully!");
			setEditingId(null);
			setEditValue("");
		},
		(error) => toast.error(`Error updating effect: ${error.message}`),
	);

	const deleteEffectMutation = useDeleteEffectMutation(
		user?.token ?? "",
		() => toast.success("Effect deleted successfully!"),
		(error) => toast.error(`Error deleting effect: ${error.message}`),
	);

	// Get mutations based on active tab
	const getCurrentMutations = () => {
		switch (activeTab) {
			case "brands":
				return {
					create: createBrandMutation,
					update: updateBrandMutation,
					delete: deleteBrandMutation,
				};
			case "categories":
				return {
					create: createCategoryMutation,
					update: updateCategoryMutation,
					delete: deleteCategoryMutation,
				};
			case "colors":
				return {
					create: createColorMutation,
					update: updateColorMutation,
					delete: deleteColorMutation,
				};
			case "effects":
				return {
					create: createEffectMutation,
					update: updateEffectMutation,
					delete: deleteEffectMutation,
				};
		}
	};

	const currentMutations = getCurrentMutations();

	// Generic handlers
	const handleEdit = (item: MetadataItem) => {
		setEditingId(item.id);
		setEditValue(item.name);
		setIsCreating(false);
	};

	const handleCancelEdit = () => {
		setEditingId(null);
		setEditValue("");
	};

	const handleCreate = () => {
		setIsCreating(true);
		setEditingId(null);
		setNewValue("");
	};

	const handleCreateCancel = () => {
		setIsCreating(false);
		setNewValue("");
	};

	const handleSave = () => {
		if (!editValue.trim()) {
			toast.error("Name is required");
			return;
		}

		if (!editingId) return;

		currentMutations.update.mutate({
			id: editingId,
			name: editValue.trim(),
		});
	};

	const handleCreateSave = () => {
		if (!newValue.trim()) {
			toast.error("Name is required");
			return;
		}

		currentMutations.create.mutate(newValue.trim());
	};

	const handleDelete = (item: MetadataItem) => {
		if (!window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
			return;
		}

		currentMutations.delete.mutate(item.id);
	};

	// Check if any mutation is in progress
	const isSaving =
		currentMutations.create.isPending ||
		currentMutations.update.isPending ||
		currentMutations.delete.isPending;

	// Table setup
	const columnHelper = createColumnHelper<MetadataItemTableItem>();

	const columns = [
		columnHelper.accessor("name", {
			header: "Name",
			cell: (info) => {
				const item = info.row.original;
				const isEditing = editingId === item.id;

				if (isEditing) {
					return (
						<input
							type="text"
							value={editValue}
							onChange={(e) => setEditValue(e.target.value)}
							className="input input-bordered input-sm w-full"
							placeholder={`${activeTab.slice(0, -1)} name`}
						/>
					);
				}

				const iconMap = {
					brands: faBuilding,
					categories: faLayerGroup,
					colors: faPalette,
					effects: faStar,
				};

				return (
					<div className="flex items-center gap-2">
						<FontAwesomeIcon
							icon={iconMap[activeTab]}
							className="text-primary"
						/>
						<span className="font-medium">{info.getValue()}</span>
					</div>
				);
			},
			meta: { className: "font-medium" },
		}),
		columnHelper.accessor("productCount", {
			header: "Products",
			cell: (info) => {
				const count = info.getValue() || 0;
				return (
					<div className="text-center">
						<span className="badge badge-primary badge-sm">
							{count} products
						</span>
					</div>
				);
			},
			meta: { className: "text-center" },
		}),
	] as ColumnDef<MetadataItemTableItem>[];

	// Add actions column for inline editing
	const actionsColumn = columnHelper.display({
		id: "actions",
		header: "Actions",
		cell: (info) => {
			const item = info.row.original;
			const isEditing = editingId === item.id;

			if (isEditing) {
				return (
					<div className="flex gap-2 justify-center">
						<button
							onClick={handleSave}
							className="btn btn-primary btn-sm"
							disabled={isSaving}
						>
							{isSaving ? (
								<FontAwesomeIcon icon={faSpinner} spin />
							) : (
								<FontAwesomeIcon icon={faSave} />
							)}
						</button>
						<button
							onClick={handleCancelEdit}
							className="btn btn-ghost btn-sm"
							disabled={isSaving}
						>
							<FontAwesomeIcon icon={faTimes} />
						</button>
					</div>
				);
			}

			return (
				<div className="flex gap-2 justify-center">
					<button
						onClick={() => handleEdit(item)}
						className="btn btn-ghost btn-sm text-warning"
						title="Edit"
					>
						<FontAwesomeIcon icon={faEdit} />
					</button>
					<button
						onClick={() => handleDelete(item)}
						className="btn btn-ghost btn-sm text-error"
						title="Delete"
						disabled={isSaving}
					>
						<FontAwesomeIcon icon={faTrash} />
					</button>
				</div>
			);
		},
		meta: { className: "text-center" },
	});

	const allColumns = [...columns, actionsColumn];

	const tabs = [
		{ id: "brands" as const, label: "Brands", icon: faBuilding },
		{ id: "categories" as const, label: "Categories", icon: faLayerGroup },
		{ id: "colors" as const, label: "Colors", icon: faPalette },
		{ id: "effects" as const, label: "Effects", icon: faStar },
	];

	const activeTabData = tabs.find((tab) => tab.id === activeTab);

	if (isLoading) {
		return <LoadingScreen />;
	}
	return (
		<div className="p-6">
			<div className="mb-6">
				<h2 className="text-2xl font-bold mb-4">Product Metadata Management</h2>
				<p className="text-gray-600">
					Manage brands, categories, colors, and effects used across all
					products
				</p>
			</div>

			{/* Tab Navigation */}
			<div className="tabs tabs-boxed mb-6">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						className={`tab gap-2 ${activeTab === tab.id ? "tab-active" : ""}`}
						onClick={() => {
							setActiveTab(tab.id);
							setEditingId(null);
							setIsCreating(false);
							setEditValue("");
							setNewValue("");
						}}
					>
						<FontAwesomeIcon icon={tab.icon} />
						{tab.label}
						<span className="badge badge-sm">
							{metadataData[tab.id].length || 0}
						</span>
					</button>
				))}
			</div>

			{/* Create Section */}
			<div className="bg-base-200 p-4 rounded-lg mb-6">
				<h3 className="text-lg font-semibold mb-4">
					{isCreating
						? `Create New ${activeTab.slice(0, -1)}`
						: `Add ${activeTab.slice(0, -1)}`}
				</h3>

				{!isCreating ? (
					<button onClick={handleCreate} className="btn btn-primary">
						<FontAwesomeIcon icon={faPlus} className="mr-2" />
						Add New {activeTab.slice(0, -1)}
					</button>
				) : (
					<div className="flex gap-4 items-end">
						<div className="flex-1">
							<label className="label">
								<span className="label-text">Name *</span>
							</label>
							<input
								type="text"
								value={newValue}
								onChange={(e) => setNewValue(e.target.value)}
								className="input input-bordered w-full"
								placeholder={`Enter ${activeTab.slice(0, -1)} name`}
							/>
						</div>
						<div className="flex gap-2">
							<button
								onClick={handleCreateSave}
								className="btn btn-primary"
								disabled={isSaving || !newValue.trim()}
							>
								{isSaving ? (
									<>
										<FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
										Creating...
									</>
								) : (
									<>
										<FontAwesomeIcon icon={faSave} className="mr-2" />
										Create
									</>
								)}
							</button>
							<button
								onClick={handleCreateCancel}
								className="btn btn-ghost"
								disabled={isSaving}
							>
								<FontAwesomeIcon icon={faTimes} className="mr-2" />
								Cancel
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Data Table (same pattern as ProductsPanel) */}
			<DataTable<MetadataItemTableItem>
				title={activeTabData?.label}
				data={
					activeTabData?.id
						? (metadataData[activeTabData.id] as MetadataItemTableItem[])
						: []
				}
				columns={allColumns}
				isLoading={isLoading}
				isError={isError}
				errorMessage={error instanceof Error ? error.message : "Unknown error"}
				searchConfig={{
					placeholder: `Search ${activeTab}...`,
					searchTerm: searchTerm,
					onSearch: setSearchTerm,
				}}
				hidePagination={true}
				initialSorting={[{ id: "name", desc: false }]}
			/>
		</div>
	);
};

export default MetadataManager;
