/* eslint-disable @typescript-eslint/no-explicit-any */
// ApparelTypesManager.tsx

import {
	getAllApparelTypesQueryOptions,
	useCreateApparelTypeMutation,
	useDeleteApparelTypeMutation,
	useUpdateApparelTypeMutation,
} from "@api/apparel/apparelQueries";
import { DataTable } from "@components/component-parts/data-table";
import {
	faEdit,
	faPlus,
	faSave,
	faShirt,
	faSpinner,
	faTimes,
	faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "@providers/auth.provider";
import { useQuery } from "@tanstack/react-query";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "react-toastify";

interface ApparelType {
	id: string;
	name: string;
	description: string | null;
	productCount?: number; // We'll add this for display purposes
}

interface ApparelTypeTableItem extends ApparelType, Record<string, unknown> {}

const ApparelTypesManager = () => {
	const { user } = useAuth();
	const [isCreating, setIsCreating] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [newTypeName, setNewTypeName] = useState("");
	const [newTypeDescription, setNewTypeDescription] = useState("");
	const [editName, setEditName] = useState("");
	const [editDescription, setEditDescription] = useState("");

	// Fetch apparel types
	const {
		data: apparelTypes,
		isLoading,
		isError,
		error,
	} = useQuery(getAllApparelTypesQueryOptions());

	// Mutations
	const createMutation = useCreateApparelTypeMutation(
		user?.token!,
		() => {
			toast.success("Apparel type created successfully!");
			setIsCreating(false);
			setNewTypeName("");
			setNewTypeDescription("");
		},
		(error) => toast.error(`Error creating apparel type: ${error.message}`),
	);

	const updateMutation = useUpdateApparelTypeMutation(
		editingId || "",
		user?.token!,
		() => {
			toast.success("Apparel type updated successfully!");
			setEditingId(null);
			setEditName("");
			setEditDescription("");
		},
		(error) => toast.error(`Error updating apparel type: ${error.message}`),
	);

	const deleteMutation = useDeleteApparelTypeMutation(
		user?.token!,
		() => toast.success("Apparel type deleted successfully!"),
		(error) => toast.error(`Error deleting apparel type: ${error.message}`),
	);

	// Handle create
	const handleCreate = () => {
		if (!newTypeName.trim()) {
			toast.error("Name is required");
			return;
		}

		createMutation.mutate({
			name: newTypeName.trim(),
			description: newTypeDescription.trim() || undefined,
		});
	};

	// Handle edit
	const startEdit = (apparelType: ApparelType) => {
		setEditingId(apparelType.id);
		setEditName(apparelType.name);
		setEditDescription(apparelType.description || "");
	};

	const handleUpdate = () => {
		if (!editName.trim()) {
			toast.error("Name is required");
			return;
		}

		updateMutation.mutate({
			name: editName.trim(),
			description: editDescription.trim() || undefined,
		});
	};

	const cancelEdit = () => {
		setEditingId(null);
		setEditName("");
		setEditDescription("");
	};

	// Handle delete
	const handleDelete = (apparelType: ApparelType) => {
		if (
			window.confirm(
				`Are you sure you want to delete "${apparelType.name}"? This action cannot be undone.`,
			)
		) {
			deleteMutation.mutate(apparelType.id);
		}
	};

	// Table setup
	const columnHelper = createColumnHelper<ApparelTypeTableItem>();

	const columns = [
		columnHelper.accessor("name", {
			header: "Name",
			cell: (info) => {
				const apparelType = info.row.original;
				const isEditing = editingId === apparelType.id;

				if (isEditing) {
					return (
						<input
							type="text"
							value={editName}
							onChange={(e) => setEditName(e.target.value)}
							className="input input-bordered input-sm w-full"
							placeholder="Apparel type name"
						/>
					);
				}

				return (
					<div className="flex items-center gap-2">
						<FontAwesomeIcon icon={faShirt} className="text-primary" />
						<span className="font-medium">{info.getValue()}</span>
					</div>
				);
			},
			meta: { className: "font-medium" },
		}),
		columnHelper.accessor("description", {
			header: "Description",
			cell: (info) => {
				const apparelType = info.row.original;
				const isEditing = editingId === apparelType.id;

				if (isEditing) {
					return (
						<textarea
							value={editDescription}
							onChange={(e) => setEditDescription(e.target.value)}
							className="textarea textarea-bordered textarea-sm w-full"
							placeholder="Optional description"
							rows={2}
						/>
					);
				}

				return (
					<span className="text-sm text-gray-600">
						{info.getValue() || <em className="opacity-50">No description</em>}
					</span>
				);
			},
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
		columnHelper.display({
			id: "actions",
			header: "Actions",
			cell: (info) => {
				const apparelType = info.row.original;
				const isEditing = editingId === apparelType.id;

				if (isEditing) {
					return (
						<div className="flex gap-2 justify-center">
							<button
								onClick={handleUpdate}
								className="btn btn-primary btn-sm"
								disabled={updateMutation.isPending}
							>
								{updateMutation.isPending ? (
									<FontAwesomeIcon icon={faSpinner} spin />
								) : (
									<FontAwesomeIcon icon={faSave} />
								)}
							</button>
							<button
								onClick={cancelEdit}
								className="btn btn-ghost btn-sm"
								disabled={updateMutation.isPending}
							>
								<FontAwesomeIcon icon={faTimes} />
							</button>
						</div>
					);
				}

				return (
					<div className="flex gap-2 justify-center">
						<button
							onClick={() => startEdit(apparelType)}
							className="btn btn-ghost btn-sm text-warning"
							title="Edit"
						>
							<FontAwesomeIcon icon={faEdit} />
						</button>
						<button
							onClick={() => handleDelete(apparelType)}
							className="btn btn-ghost btn-sm text-error"
							title="Delete"
							disabled={deleteMutation.isPending}
						>
							<FontAwesomeIcon icon={faTrash} />
						</button>
					</div>
				);
			},
			meta: { className: "text-center" },
		}),
	] as ColumnDef<ApparelTypeTableItem>[];

	if (isLoading) {
		return (
			<div className="flex justify-center items-center p-8">
				<FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
				<span>Loading apparel types...</span>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="alert alert-error">
				<span>Error loading apparel types: {error?.message}</span>
			</div>
		);
	}

	return (
		<div className="p-6">
			<div className="mb-6">
				<h2 className="text-2xl font-bold mb-4">Manage Apparel Types</h2>
				<p className="text-gray-600 mb-4">
					Create and manage different types of apparel products (T-Shirts,
					Hoodies, etc.)
				</p>

				{/* Create New Apparel Type */}
				<div className="bg-base-200 p-4 rounded-lg mb-6">
					<h3 className="text-lg font-semibold mb-4">
						{isCreating ? "Create New Apparel Type" : "Add Apparel Type"}
					</h3>

					{!isCreating ? (
						<button
							onClick={() => setIsCreating(true)}
							className="btn btn-primary"
						>
							<FontAwesomeIcon icon={faPlus} className="mr-2" />
							Add New Type
						</button>
					) : (
						<div className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="label">
										<span className="label-text">Name *</span>
									</label>
									<input
										type="text"
										value={newTypeName}
										onChange={(e) => setNewTypeName(e.target.value)}
										className="input input-bordered w-full"
										placeholder="e.g., T-Shirt, Hoodie, Tank Top"
									/>
								</div>
								<div>
									<label className="label">
										<span className="label-text">Description</span>
									</label>
									<input
										type="text"
										value={newTypeDescription}
										onChange={(e) => setNewTypeDescription(e.target.value)}
										className="input input-bordered w-full"
										placeholder="Optional description"
									/>
								</div>
							</div>

							<div className="flex gap-2">
								<button
									onClick={handleCreate}
									className="btn btn-primary"
									disabled={createMutation.isPending || !newTypeName.trim()}
								>
									{createMutation.isPending ? (
										<>
											<FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
											Creating...
										</>
									) : (
										<>
											<FontAwesomeIcon icon={faSave} className="mr-2" />
											Create Type
										</>
									)}
								</button>
								<button
									onClick={() => {
										setIsCreating(false);
										setNewTypeName("");
										setNewTypeDescription("");
									}}
									className="btn btn-ghost"
									disabled={createMutation.isPending}
								>
									<FontAwesomeIcon icon={faTimes} className="mr-2" />
									Cancel
								</button>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Apparel Types Table */}
			<DataTable<ApparelTypeTableItem>
				title="Apparel Types"
				data={Array.isArray(apparelTypes) ? apparelTypes : []}
				columns={columns}
				isLoading={isLoading}
				isError={isError}
				errorMessage={
					error && typeof error === "object" && "message" in error
						? (error as { message?: string }).message ||
							"Error loading apparel types"
						: "Error loading apparel types"
				}
				pagination={{
					currentPage: 1,
					pageSize: 25,
					setPage: () => {},
					setPageSize: () => {},
					hasMore: false,
					isFetching: false,
					isPlaceholderData: false,
					totalRows: apparelTypes?.length,
					manualPagination: true,
				}}
			/>

			{/* Stats */}
			{apparelTypes && apparelTypes.length > 0 && (
				<div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="stat bg-base-200 rounded-lg">
						<div className="stat-title">Total Types</div>
						<div className="stat-value text-primary">{apparelTypes.length}</div>
						<div className="stat-desc">Apparel categories</div>
					</div>

					<div className="stat bg-base-200 rounded-lg">
						<div className="stat-title">Most Common</div>
						<div className="stat-value text-secondary text-lg">
							{apparelTypes[0]?.name || "N/A"}
						</div>
						<div className="stat-desc">First created type</div>
					</div>

					<div className="stat bg-base-200 rounded-lg">
						<div className="stat-title">With Descriptions</div>
						<div className="stat-value text-accent">
							{
								apparelTypes.filter(
									(type: { description: any }) => type.description,
								).length
							}
						</div>
						<div className="stat-desc">Types have descriptions</div>
					</div>
				</div>
			)}

			{/* Empty State */}
			{apparelTypes && apparelTypes.length === 0 && (
				<div className="text-center py-8">
					<FontAwesomeIcon
						icon={faShirt}
						size="3x"
						className="text-gray-400 mb-4"
					/>
					<p className="text-xl text-gray-600 mb-2">No apparel types yet</p>
					<p className="text-gray-500 mb-4">
						Create your first apparel type to start organizing your products
					</p>
					{!isCreating && (
						<button
							onClick={() => setIsCreating(true)}
							className="btn btn-primary"
						>
							<FontAwesomeIcon icon={faPlus} className="mr-2" />
							Create First Type
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export default ApparelTypesManager;
