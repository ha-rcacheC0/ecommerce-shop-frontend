// src/components/ProductsPanel.tsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminPageLayout from "./AdminPageLayout";
import {
  faBoxes,
  faPlus,
  faEdit,
  faTrash,
  faSearch,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../providers/auth.provider";
import { TProduct } from "../types";
import {
  getAllProductsQueryOptions,
  useDeleteProductMutation,
} from "../api/products/productsQueries";
import { toast } from "react-toastify";
import { Link } from "@tanstack/react-router";
import { PageButtons } from "./component-parts/pageButtons";

const ProductsPanel: React.FC = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedView, setSelectedView] = useState<string | null>(
    "all-products"
  );

  // Get products based on filters
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
      searchTitle,
      isShow: false, // Only regular products, not shows
      selectedBrands: selectedView === "by-brand" ? [] : undefined,
      selectedCategories: selectedView === "by-category" ? [] : undefined,
    })
  );

  // Delete product mutation
  const deleteMutation = useDeleteProductMutation(
    user!.token!,
    () => {
      toast.success("Product deleted successfully");
    },
    (error) => {
      toast.error(`Error deleting product: ${error.message}`);
    }
  );

  // Handler for product deletion
  const handleDeleteProduct = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  // Sidebar items for the AdminPageLayout
  const sidebarItems = [
    { icon: faBoxes, label: "All Products", id: "all-products" },
    { icon: faFilter, label: "By Category", id: "by-category" },
    { icon: faFilter, label: "By Brand", id: "by-brand" },
    { icon: faFilter, label: "Out of Stock", id: "out-of-stock" },
  ];

  return (
    <AdminPageLayout title="Product Management" sidebarItems={sidebarItems}>
      {(selectedItem) => {
        setSelectedView(selectedItem);

        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-700">
                {selectedItem
                  ? selectedItem
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())
                  : "All Products"}
              </h2>

              <Link to="/admin/products/create" className="btn btn-primary">
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Create Product
              </Link>
            </div>

            {/* Search and filter controls */}
            <div className="mb-6">
              <div className="flex gap-4">
                <div className="form-control w-full max-w-md">
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="input input-bordered w-full"
                      value={searchTitle}
                      onChange={(e) => setSearchTitle(e.target.value)}
                    />
                    <button className="btn btn-square">
                      <FontAwesomeIcon icon={faSearch} />
                    </button>
                  </div>
                </div>

                {/* Additional filters could go here */}
              </div>
            </div>

            {/* Products table */}
            <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
              {isLoading ? (
                <div className="text-center py-4">Loading products...</div>
              ) : isError ? (
                <div className="text-center py-4 text-error">
                  Error loading products:{" "}
                  {error instanceof Error ? error.message : "Unknown error"}
                </div>
              ) : productsData?.contents?.length === 0 ? (
                <div className="text-center py-8">
                  <p>No products found.</p>
                </div>
              ) : (
                <>
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>SKU</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Brand</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productsData?.contents.map((product: TProduct) => (
                        <tr key={product.id}>
                          <td>
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
                          </td>
                          <td>{product.sku}</td>
                          <td className="font-medium">{product.title}</td>
                          <td>{product.category.name}</td>
                          <td>{product.brand.name}</td>
                          <td>
                            $
                            {parseFloat(product.casePrice.toString()).toFixed(
                              2
                            )}
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                product.inStock
                                  ? "badge-success"
                                  : "badge-error"
                              }`}
                            >
                              {product.inStock ? "In Stock" : "Out of Stock"}
                            </span>
                          </td>
                          <td>
                            <div className="flex space-x-2">
                              <Link
                                to="/admin/products/$productId/edit"
                                params={{ productId: product.id }}
                                className="btn btn-sm btn-warning"
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </Link>
                              <button
                                className="btn btn-sm btn-error"
                                onClick={() =>
                                  handleDeleteProduct(product.id, product.title)
                                }
                                disabled={deleteMutation.isPending}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  <div className="p-4">
                    <PageButtons
                      isFetching={isFetching}
                      isPlaceholderData={isPlaceholderData}
                      setPage={setPage}
                      page={page}
                      hasMore={productsData?.hasMore || false}
                      pageSize={pageSize}
                      setPageAmount={setPageSize}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        );
      }}
    </AdminPageLayout>
  );
};

export default ProductsPanel;
