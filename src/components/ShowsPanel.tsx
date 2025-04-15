import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminPageLayout from "./AdminPageLayout";
import {
  faTheaterMasks,
  faBoxes,
  faPlus,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getAllShowsQueryOptions,
  useDeleteShowMutation,
} from "../api/shows/showsQueries";
import { Link } from "@tanstack/react-router";
import { Show } from "../types";
import { toast } from "react-toastify";
import ShowTypesManager from "./ShowTypesManager";

const ShowsTable: React.FC<{ selectedView: string | null }> = ({
  selectedView,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: shows,
    isLoading,
    isError,
  } = useQuery(getAllShowsQueryOptions());

  const deleteShowMutation = useDeleteShowMutation(
    () => {
      toast.success("Show deleted successfully");
    },
    (error) => {
      toast.error(`Error deleting show: ${error.message}`);
    }
  );

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (isError)
    return <div className="text-center text-red-500">Error fetching shows</div>;

  // Filter shows based on search term and selectedView
  const filteredShows = shows?.filter((show: Show) => {
    const matchesSearch =
      show.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      show.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="mx-auto my-4 w-full">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search shows..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-1/3"
        />
        <Link to="/admin/shows/create" className="btn btn-primary">
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Create New Show
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Price</th>
              <th>Products</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredShows?.map((show: Show) => (
              <tr key={show.id}>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img src={show.image} alt={show.title} />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{show.title}</div>
                    </div>
                  </div>
                </td>
                <td>{show.ShowType.name}</td>
                <td>${parseFloat(show.price).toFixed(2)}</td>
                <td>{show.ShowProducts.length} products</td>
                <td>
                  <span
                    className={`badge ${show.inStock ? "badge-success" : "badge-error"}`}
                  >
                    {show.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
                <td>
                  <div className="flex space-x-2">
                    <Link
                      to="/admin/shows/$showId/edit"
                      params={{ showId: show.id }}
                      className="btn btn-sm btn-warning"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Link>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this show?"
                          )
                        ) {
                          deleteShowMutation.mutate(show.id);
                        }
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ShowsPanel: React.FC = () => {
  const showsSidebarItems = [
    { icon: faTheaterMasks, label: "All Shows", id: "all-shows" },
    { icon: faBoxes, label: "Manage Types", id: "manage-types" },
  ];

  return (
    <AdminPageLayout title="Shows Management" sidebarItems={showsSidebarItems}>
      {(selectedItem) => (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">
            {selectedItem === "manage-types"
              ? "Manage Show Types"
              : "All Shows"}
          </h2>

          {selectedItem === "manage-types" ? (
            <ShowTypesManager />
          ) : (
            <ShowsTable selectedView={selectedItem} />
          )}
        </div>
      )}
    </AdminPageLayout>
  );
};

export default ShowsPanel;
