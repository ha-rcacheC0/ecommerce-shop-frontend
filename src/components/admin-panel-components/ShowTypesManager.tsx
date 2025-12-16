import { getAllShowTypesQueryOptions } from "@api/shows/showsQueries";
import {
	faEdit,
	faPlus,
	faSave,
	faTimes,
	faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import type { ShowType } from "@/types";

// This is a basic API function that we can implement later
// or import from your shows API file
const createShowType = async (data: { name: string; description?: string }) => {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/shows/types`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		},
	);

	if (!response.ok) {
		throw new Error("Failed to create show type");
	}

	return response.json();
};

const updateShowType = async (
	id: string,
	data: { name: string; description?: string },
) => {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/shows/types/${id}`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		},
	);

	if (!response.ok) {
		throw new Error("Failed to update show type");
	}

	return response.json();
};

const deleteShowType = async (id: string) => {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/shows/types/${id}`,
		{
			method: "DELETE",
		},
	);

	if (!response.ok) {
		throw new Error("Failed to delete show type");
	}

	return true;
};

const ShowTypesManager: React.FC = () => {
	const queryClient = useQueryClient();
	const { data: showTypes, isLoading } = useQuery(
		getAllShowTypesQueryOptions(),
	);

	const [isCreating, setIsCreating] = useState(false);
	const [isEditing, setIsEditing] = useState<string | null>(null);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");

	const createMutation = useMutation({
		mutationFn: createShowType,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["showTypes"] });
			setIsCreating(false);
			setName("");
			setDescription("");
			toast.success("Show type created successfully");
		},
		onError: (error: Error) => {
			toast.error(`Error creating show type: ${error.message}`);
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: { name: string; description?: string };
		}) => updateShowType(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["showTypes"] });
			setIsEditing(null);
			setName("");
			setDescription("");
			toast.success("Show type updated successfully");
		},
		onError: (error: Error) => {
			toast.error(`Error updating show type: ${error.message}`);
		},
	});

	const deleteMutation = useMutation({
		mutationFn: deleteShowType,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["showTypes"] });
			toast.success("Show type deleted successfully");
		},
		onError: (error: Error) => {
			toast.error(`Error deleting show type: ${error.message}`);
		},
	});

	const handleCreateSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) {
			toast.error("Name is required");
			return;
		}

		createMutation.mutate({
			name,
			description: description.trim() ? description : undefined,
		});
	};

	const handleUpdateSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim() || !isEditing) {
			toast.error("Name is required");
			return;
		}

		updateMutation.mutate({
			id: isEditing,
			data: {
				name,
				description: description.trim() ? description : undefined,
			},
		});
	};

	const handleEdit = (showType: ShowType) => {
		setIsEditing(showType.id);
		setName(showType.name);
		setDescription(showType.description || "");
	};

	const handleDelete = (id: string) => {
		if (window.confirm("Are you sure you want to delete this show type?")) {
			deleteMutation.mutate(id);
		}
	};

	const cancelForm = () => {
		setIsCreating(false);
		setIsEditing(null);
		setName("");
		setDescription("");
	};

	if (isLoading) {
		return <div className="text-center p-8">Loading...</div>;
	}

	return (
		<div className="container mx-auto p-6 bg-base-100 rounded-lg shadow-lg">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Manage Show Types</h1>
				{!isCreating && !isEditing && (
					<button
						type="button"
						className="btn btn-primary"
						onClick={() => setIsCreating(true)}
					>
						<FontAwesomeIcon icon={faPlus} className="mr-2" />
						Create New Type
					</button>
				)}
			</div>

			{/* Create Form */}
			{isCreating && (
				<div className="mb-8 p-4 border rounded-lg">
					<h2 className="text-xl font-semibold mb-4">Create New Show Type</h2>
					<form onSubmit={handleCreateSubmit} className="space-y-4">
						<div className="form-control">
							<label className="label">
								<span className="label-text">Name *</span>
							</label>
							<input
								type="text"
								className="input input-bordered"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>

						<div className="form-control">
							<label className="label">
								<span className="label-text">Description</span>
							</label>
							<textarea
								className="textarea textarea-bordered"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							></textarea>
						</div>

						<div className="flex justify-end space-x-2">
							<button
								type="button"
								className="btn btn-outline"
								onClick={cancelForm}
							>
								<FontAwesomeIcon icon={faTimes} className="mr-2" />
								Cancel
							</button>
							<button
								type="submit"
								className="btn btn-primary"
								disabled={createMutation.isPending}
							>
								{createMutation.isPending ? (
									<span className="loading loading-spinner loading-sm mr-2"></span>
								) : (
									<FontAwesomeIcon icon={faSave} className="mr-2" />
								)}
								Save
							</button>
						</div>
					</form>
				</div>
			)}

			{/* Edit Form */}
			{isEditing && (
				<div className="mb-8 p-4 border rounded-lg">
					<h2 className="text-xl font-semibold mb-4">Edit Show Type</h2>
					<form onSubmit={handleUpdateSubmit} className="space-y-4">
						<div className="form-control">
							<label className="label">
								<span className="label-text">Name *</span>
							</label>
							<input
								type="text"
								className="input input-bordered"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>

						<div className="form-control">
							<label className="label">
								<span className="label-text">Description</span>
							</label>
							<textarea
								className="textarea textarea-bordered"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							></textarea>
						</div>

						<div className="flex justify-end space-x-2">
							<button
								type="button"
								className="btn btn-outline"
								onClick={cancelForm}
							>
								<FontAwesomeIcon icon={faTimes} className="mr-2" />
								Cancel
							</button>
							<button
								type="submit"
								className="btn btn-primary"
								disabled={updateMutation.isPending}
							>
								{updateMutation.isPending ? (
									<span className="loading loading-spinner loading-sm mr-2"></span>
								) : (
									<FontAwesomeIcon icon={faSave} className="mr-2" />
								)}
								Update
							</button>
						</div>
					</form>
				</div>
			)}

			{/* Show Types Table */}
			<div className="overflow-x-auto">
				<table className="table w-full">
					<thead>
						<tr>
							<th>Name</th>
							<th>Description</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{showTypes.map((type: ShowType) => (
							<tr key={type.id}>
								<td className="font-medium">{type.name}</td>
								<td>{type.description || "—"}</td>
								<td>
									<div className="flex space-x-2">
										<button
											className="btn btn-sm btn-warning"
											onClick={() => handleEdit(type)}
											disabled={isCreating || !!isEditing}
										>
											<FontAwesomeIcon icon={faEdit} />
										</button>
										<button
											className="btn btn-sm btn-error"
											onClick={() => handleDelete(type.id)}
											disabled={
												isCreating || !!isEditing || deleteMutation.isPending
											}
										>
											<FontAwesomeIcon icon={faTrash} />
										</button>
									</div>
								</td>
							</tr>
						))}
						{showTypes.length === 0 && (
							<tr>
								<td colSpan={3} className="text-center py-4 text-gray-500">
									No show types found. Create one to get started.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ShowTypesManager;
