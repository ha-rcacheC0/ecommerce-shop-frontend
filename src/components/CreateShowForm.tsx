import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllShowTypesQueryOptions } from "../api/shows/showsQueries";
import { getAllProductsQueryOptions } from "../api/products/productsQueries";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faPlus,
  faTrash,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "@tanstack/react-router";
import { useCreateShowMutation } from "../api/shows/showsQueries";
import { toast } from "react-toastify";
import { TProduct } from "../types";
import { CreateShowData, CreateShowProduct } from "../api/shows/shows";

const CreateShowForm: React.FC = () => {
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [videoURL, setVideoURL] = useState("");
  const [inStock, setInStock] = useState(true);
  const [showTypeId, setShowTypeId] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<CreateShowProduct[]>(
    []
  );

  // Search state for products
  const [searchTerm, setSearchTerm] = useState("");
  const [isSelectingProduct, setIsSelectingProduct] = useState(false);

  // Fetch data
  const { data: showTypes, isLoading: typesLoading } = useQuery(
    getAllShowTypesQueryOptions()
  );
  const { data: productsData, isLoading: productsLoading } = useQuery(
    getAllProductsQueryOptions({ page: 1, pageSize: 100 })
  );

  // Mutation for creating a show
  const createShowMutation = useCreateShowMutation(
    () => {
      toast.success("Show created successfully!");
      navigate({ to: "/admin/shows" });
    },
    (error) => {
      toast.error(`Error creating show: ${error.message}`);
    }
  );

  // Filter products based on search term
  const filteredProducts = productsData?.contents.filter(
    (product: TProduct) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toString().includes(searchTerm)
  );

  // Handle adding a product to the show
  const handleAddProduct = (product: TProduct) => {
    // Check if product is already in the show
    if (selectedProducts.some((p) => p.productId === product.id)) {
      toast.warning("This product is already in the show");
      return;
    }

    setSelectedProducts([
      ...selectedProducts,
      {
        productId: product.id,
        quantity: 1,
        notes: "",
      },
    ]);
    setIsSelectingProduct(false);
    setSearchTerm("");
  };

  // Handle removing a product from the show
  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(
      selectedProducts.filter((p) => p.productId !== productId)
    );
  };

  // Handle updating product quantity
  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setSelectedProducts(
      selectedProducts.map((p) =>
        p.productId === productId
          ? { ...p, quantity: Math.max(1, quantity) }
          : p
      )
    );
  };

  // Handle updating product notes
  const handleUpdateNotes = (productId: string, notes: string) => {
    setSelectedProducts(
      selectedProducts.map((p) =>
        p.productId === productId ? { ...p, notes } : p
      )
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

    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      toast.error("Valid price is required");
      return;
    }

    if (selectedProducts.length === 0) {
      toast.error("At least one product is required");
      return;
    }

    const showData: CreateShowData = {
      title,
      description: description || undefined,
      price: parseFloat(price),
      image: image || undefined,
      videoURL: videoURL || undefined,
      inStock,
      showTypeId,
      products: selectedProducts,
    };

    createShowMutation.mutate(showData);
  };

  if (typesLoading || productsLoading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-base-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Create New Show</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Show Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Title *</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Show Type *</span>
            </label>
            <select
              className="select select-bordered"
              value={showTypeId}
              onChange={(e) => setShowTypeId(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Show Type
              </option>
              {showTypes.map((type: { id: string; name: string }) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Price *</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="input input-bordered"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Image URL</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Video URL</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={videoURL}
              onChange={(e) => setVideoURL(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">In Stock</span>
              <input
                type="checkbox"
                className="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
              />
            </label>
          </div>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            className="textarea textarea-bordered h-24"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        {/* Products Section */}
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Products</h2>
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

                <input
                  type="text"
                  placeholder="Search products..."
                  className="input input-bordered w-full mb-4"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="overflow-y-auto max-h-96">
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
                      {filteredProducts?.map((product: TProduct) => (
                        <tr key={product.id}>
                          <td>
                            <div className="flex items-center space-x-3">
                              <div className="avatar">
                                <div className="mask mask-squircle w-12 h-12">
                                  <img
                                    src={product.image}
                                    alt={product.title}
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="font-bold">{product.title}</div>
                                <div className="text-sm opacity-50">
                                  {product.brand?.name} -{" "}
                                  {product.category?.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>{product.sku}</td>
                          <td>${parseFloat(product.casePrice).toFixed(2)}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={() => handleAddProduct(product)}
                            >
                              <FontAwesomeIcon icon={faPlus} className="mr-2" />
                              Add
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                  <th>Quantity</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((selectedProduct) => {
                  const product = productsData?.contents.find(
                    (p: TProduct) => p.id === selectedProduct.productId
                  );

                  if (!product) return null;

                  return (
                    <tr key={selectedProduct.productId}>
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <img src={product.image} alt={product.title} />
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
                        <input
                          type="number"
                          min="1"
                          className="input input-bordered w-20"
                          value={selectedProduct.quantity}
                          onChange={(e) =>
                            handleUpdateQuantity(
                              selectedProduct.productId,
                              parseInt(e.target.value) || 1
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
                              e.target.value
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
                            handleRemoveProduct(selectedProduct.productId)
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
            <div className="text-center py-4 text-gray-500">
              No products added to this show yet. Click "Add Product" to get
              started.
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate({ to: "/admin/shows" })}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={createShowMutation.isPending}
          >
            {createShowMutation.isPending ? (
              <span className="loading loading-spinner loading-sm mr-2"></span>
            ) : (
              <FontAwesomeIcon icon={faSave} className="mr-2" />
            )}
            Save Show
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateShowForm;
