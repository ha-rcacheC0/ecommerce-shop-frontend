/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/ProductForm.tsx
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { getProductMetadataQueryOptions } from "../api/products/productsQueries";
import { getOneProductQueryOptions } from "../api/products/productsQueries";
import { useAuth } from "../providers/auth.provider";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "../api/products/productsQueries";
import { toast } from "react-toastify";

interface ProductFormProps {
  productId?: string;
  isEditing?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  productId,
  isEditing = false,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Form state
  const [sku, setSku] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [casePrice, setCasePrice] = useState("");
  const [packageString, setPackageString] = useState("");
  const [inStock, setInStock] = useState(true);
  const [isCaseBreakable, setIsCaseBreakable] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedEffects, setSelectedEffects] = useState<string[]>([]);

  // Calculated fields
  const [estimatedUnitPrice, setEstimatedUnitPrice] = useState<number | null>(
    null
  );

  // Mutations
  const createProductMutation = useCreateProductMutation(
    user!.token!,
    () => {
      toast.success("Product created successfully!");
      navigate({ to: "/admin/products" });
    },
    (error) => {
      toast.error(`Error creating product: ${error.message}`);
    }
  );

  const updateProductMutation = useUpdateProductMutation(
    user!.token!,
    () => {
      toast.success("Product updated successfully!");
      navigate({ to: "/admin/products" });
    },
    (error) => {
      toast.error(`Error updating product: ${error.message}`);
    }
  );

  // Get product metadata (brands, categories, colors, effects)
  const { data: metadata, isLoading: metadataLoading } = useQuery(
    getProductMetadataQueryOptions()
  );

  // Get product data if editing
  const { data: productData, isLoading: productLoading } = useQuery({
    ...getOneProductQueryOptions({ id: productId || "" }),
    enabled: isEditing && !!productId,
  });

  // Initialize form with product data if editing
  useEffect(() => {
    if (isEditing && productData) {
      setSku(productData.sku);
      setTitle(productData.title);
      setDescription(productData.description || "");
      setCasePrice(parseFloat(productData.casePrice.toString()).toFixed(2));
      setPackageString(productData.package.join(","));
      setInStock(productData.inStock);
      setIsCaseBreakable(productData.isCaseBreakable);
      setImageUrl(productData.image);
      setVideoUrl(productData.videoURL || "");
      setSelectedBrandId(productData.brand?.id || "");
      setSelectedCategoryId(productData.category?.id || "");
      setSelectedColors(
        productData.colors?.map((c: { id: any }) => c.id) || []
      );
      setSelectedEffects(
        productData.effects?.map((e: { id: any }) => e.id) || []
      );
    }
  }, [isEditing, productData]);

  // Calculate estimated unit price when case price or package changes
  useEffect(() => {
    if (casePrice && packageString) {
      try {
        const casePriceNum = parseFloat(casePrice);
        const packageNums = packageString.split(",").map(Number);

        if (
          !isNaN(casePriceNum) &&
          packageNums.length > 0 &&
          !isNaN(packageNums[0]) &&
          packageNums[0] > 0
        ) {
          // Use the calcUnitPrice function from your utils
          const unitPrice =
            Math.ceil((casePriceNum / 1.53 / packageNums[0]) * 2.42) - 0.01;
          setEstimatedUnitPrice(unitPrice);
        } else {
          setEstimatedUnitPrice(null);
        }
      } catch (e) {
        setEstimatedUnitPrice(null);
      }
    } else {
      setEstimatedUnitPrice(null);
    }
  }, [casePrice, packageString]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!sku) {
      toast.error("SKU is required");
      return;
    }

    if (!title) {
      toast.error("Title is required");
      return;
    }

    if (
      !casePrice ||
      isNaN(parseFloat(casePrice)) ||
      parseFloat(casePrice) <= 0
    ) {
      toast.error("Valid case price is required");
      return;
    }

    if (!packageString) {
      toast.error("Package information is required");
      return;
    }

    try {
      const packageNums = packageString.split(",").map(Number);
      if (packageNums.some((num) => isNaN(num) || num <= 0)) {
        toast.error(
          "Package must be a comma-separated list of positive numbers"
        );
        return;
      }
    } catch (e) {
      toast.error("Invalid package format");
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

    // Prepare product data
    const productData = {
      sku,
      title,
      description,
      casePrice,
      inStock,
      package: packageString,
      isCaseBreakable,
      image: imageUrl || "placeholder",
      videoURL: videoUrl || undefined,
      brandId: selectedBrandId,
      categoryId: selectedCategoryId,
      colors: selectedColors,
      effects: selectedEffects,
    };

    // Submit form
    if (isEditing && productId) {
      updateProductMutation.mutate({ id: productId, data: productData });
    } else {
      createProductMutation.mutate(productData);
    }
  };

  // Toggle selection for multi-select items (colors, effects)
  const toggleSelection = (
    id: string,
    selectedItems: string[],
    setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const isLoading = metadataLoading || (isEditing && productLoading);
  const isSaving =
    createProductMutation.isPending || updateProductMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-base-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing
          ? `Edit Product: ${productData?.title}`
          : "Create New Product"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-base-200 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">SKU *</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                required
                disabled={isEditing} // SKU cannot be changed if editing
              />
            </div>

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
                <span className="label-text">Case Price *</span>
              </label>
              <div className="input-group">
                <span>$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="input input-bordered w-full"
                  value={casePrice}
                  onChange={(e) => setCasePrice(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Package (comma-separated) *</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={packageString}
                onChange={(e) => setPackageString(e.target.value)}
                placeholder="e.g., 6,8,12"
                required
              />
              <label className="label">
                <span className="label-text-alt">
                  First number is quantity per case
                </span>
              </label>
            </div>
          </div>

          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Pricing & Availability */}
        <div className="bg-base-200 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Pricing & Availability</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="cursor-pointer label justify-start gap-4">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                />
                <span className="label-text">In Stock</span>
              </label>
            </div>

            <div className="form-control">
              <label className="cursor-pointer label justify-start gap-4">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={isCaseBreakable}
                  onChange={(e) => setIsCaseBreakable(e.target.checked)}
                />
                <span className="label-text">
                  Case Breakable (Sell as Units)
                </span>
              </label>
            </div>
          </div>

          {isCaseBreakable && estimatedUnitPrice !== null && (
            <div className="mt-2 p-2 bg-base-300 rounded-md">
              <p className="text-sm font-medium">
                Estimated Unit Price: ${estimatedUnitPrice.toFixed(2)}
              </p>
              <p className="text-xs opacity-70">
                Based on current case price and package quantity
              </p>
            </div>
          )}
        </div>

        {/* Media */}
        <div className="bg-base-200 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Image URL</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
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
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>

          {imageUrl && (
            <div className="mt-4 flex justify-center">
              <div className="w-40 h-40 rounded-md overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Product Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.png";
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Classification */}
        <div className="bg-base-200 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Classification</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Brand *</span>
              </label>
              <select
                className="select select-bordered"
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
                  )
                )}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Category *</span>
              </label>
              <select
                className="select select-bordered"
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
                  )
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Colors and Effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-base-200 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Colors</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {metadata?.colors?.map((color: { id: string; name: string }) => (
                <label
                  key={color.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={selectedColors.includes(color.id)}
                    onChange={() =>
                      toggleSelection(
                        color.id,
                        selectedColors,
                        setSelectedColors
                      )
                    }
                  />
                  <span>{color.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-base-200 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Effects</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {metadata?.effects?.map(
                (effect: { id: string; name: string }) => (
                  <label
                    key={effect.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={selectedEffects.includes(effect.id)}
                      onChange={() =>
                        toggleSelection(
                          effect.id,
                          selectedEffects,
                          setSelectedEffects
                        )
                      }
                    />
                    <span>{effect.name}</span>
                  </label>
                )
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate({ to: "/admin/products" })}
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

export default ProductForm;
