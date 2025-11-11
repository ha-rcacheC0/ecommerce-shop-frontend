/* eslint-disable @typescript-eslint/no-explicit-any */
// @components/apparelProductCard.tsx - Updated for variants
import React, { useState } from "react";
import { TProduct, ProductVariant, BrandDisplay } from "@/types";
import { Link } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../providers/auth.provider";
import { useAddItemToCartMutation } from "../api/cart/cartQueries";
import { toast } from "react-toastify";

interface ApparelProductCardProps {
  product: TProduct;
  searchParams: any;
}

export const ApparelProductCard: React.FC<ApparelProductCardProps> = ({
  product,
  searchParams,
}) => {
  const [imageError, setImageError] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.[0] || null
  );

  const { authState, user } = useAuth();
  const userCartId = user?.userInfo?.Cart?.id;

  const addItem = useAddItemToCartMutation(
    userCartId!,
    () => {
      toast.success(`${product.title} added to cart!`, {
        position: "bottom-right",
      });
    },
    () => {
      toast.error("Failed to add product to cart", {
        position: "bottom-right",
      });
    }
  );

  const handleImageError = () => {
    setImageError(true);
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return numPrice.toFixed(2);
  };

  const getImageSrc = () => {
    if (imageError || !product.image || product.image === "placeholder") {
      return "/images/placeholder-apparel.jpg";
    }
    return product.image;
  };

  // Get unique sizes from variants
  const availableSizes = Array.from(
    new Set(product.variants?.map((v) => v.size) || [])
  );

  // Get unique genders from variants
  const availableGenders = Array.from(
    new Set(product.variants?.map((v) => v.gender) || [])
  );

  // Get available colors for selected size and gender
  const availableColors =
    product.variants?.filter(
      (variant) =>
        variant.size === selectedVariant?.size &&
        variant.gender === selectedVariant?.gender
    ) || [];

  const handleSizeChange = (size: string) => {
    // Find first variant with this size, preferring current gender if available
    const newVariant =
      product.variants?.find(
        (v) => v.size === size && v.gender === selectedVariant?.gender
      ) || product.variants?.find((v) => v.size === size);

    if (newVariant) {
      setSelectedVariant(newVariant);
    }
  };

  const handleGenderChange = (gender: "MALE" | "FEMALE" | "UNISEX") => {
    // Find first variant with this gender, preferring current size if available
    const newVariant =
      product.variants?.find(
        (v) => v.gender === gender && v.size === selectedVariant?.size
      ) || product.variants?.find((v) => v.gender === gender);

    if (newVariant) {
      setSelectedVariant(newVariant);
    }
  };

  const handleColorChange = (colorId: string | null) => {
    const newVariant = product.variants?.find(
      (v) =>
        v.size === selectedVariant?.size &&
        v.gender === selectedVariant?.gender &&
        v.colorId === colorId
    );

    if (newVariant) {
      setSelectedVariant(newVariant);
    }
  };

  const isInStock =
    selectedVariant?.availableStock && selectedVariant.availableStock > 0;
  const genderDisplay = {
    MALE: "Men's",
    FEMALE: "Women's",
    UNISEX: "Unisex",
  };

  return (
    <div className="flex flex-col h-full bg-base-100 shadow-md shadow-secondary rounded-sm hover:shadow-xl transition-shadow duration-300">
      <figure className="relative">
        <div className="badge badge-accent absolute top-2 left-2 z-10">
          SKU: {product.sku}
        </div>
        {product.apparelType && (
          <div className="badge badge-primary absolute top-2 right-2 z-10">
            {product.apparelType.name}
          </div>
        )}
        <Link
          to="/apparel/$productId"
          params={{ productId: product.id }}
          search={searchParams}
        >
          <img
            className="w-full h-[280px] object-contain object-center"
            src={getImageSrc()}
            alt={product.title}
            onError={handleImageError}
          />
        </Link>
      </figure>

      <div className="flex flex-col flex-grow p-4">
        <Link
          to="/apparel/$productId"
          params={{ productId: product.id }}
          search={searchParams}
          className="mb-4"
        >
          <h2 className="card-title text-xl font-bold line-clamp-2 h-14">
            {product.title}
          </h2>
        </Link>

        {/* Brand and Category */}
        <div className="flex gap-2 mb-4">
          <div className="badge badge-outline text-xs">
            {BrandDisplay[product.brand.name]}
          </div>
        </div>

        {/* Selected Variant Info */}
        {selectedVariant && (
          <div className="mb-3 text-sm text-gray-600">
            <span className="font-medium">Selected:</span>{" "}
            {selectedVariant.size} - {genderDisplay[selectedVariant.gender]}
            {selectedVariant.color && ` - ${selectedVariant.color.name}`}
          </div>
        )}

        {/* Size Selection */}
        {availableSizes.length > 0 && (
          <div className="mb-3">
            <label className="text-sm font-medium mb-2 block">Size:</label>
            <div className="flex flex-wrap gap-1">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  className={`badge badge-sm cursor-pointer transition-colors ${
                    selectedVariant?.size === size
                      ? "badge-primary"
                      : "badge-outline hover:badge-primary"
                  }`}
                  onClick={() => handleSizeChange(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Gender Selection */}
        {availableGenders.length > 1 && (
          <div className="mb-3">
            <label className="text-sm font-medium mb-2 block">Style:</label>
            <div className="flex flex-wrap gap-1">
              {availableGenders.map((gender) => (
                <button
                  key={gender}
                  className={`badge badge-sm cursor-pointer transition-colors ${
                    selectedVariant?.gender === gender
                      ? "badge-secondary"
                      : "badge-outline hover:badge-secondary"
                  }`}
                  onClick={() => handleGenderChange(gender)}
                >
                  {genderDisplay[gender]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color Selection */}
        {availableColors.length > 1 && (
          <div className="mb-3">
            <label className="text-sm font-medium mb-2 block">Color:</label>
            <div className="flex flex-wrap gap-1">
              {availableColors.map((variant) => (
                <button
                  key={variant.id}
                  className={`badge badge-sm cursor-pointer transition-colors ${
                    selectedVariant?.colorId === variant.colorId
                      ? "badge-accent"
                      : "badge-outline hover:badge-accent"
                  }`}
                  onClick={() => handleColorChange(variant.colorId)}
                >
                  {variant.color?.name || "Default"}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4 mt-auto">
          {/* Pricing */}
          <div className="grid grid-cols-2 gap-2">
            {selectedVariant && (
              <div className="flex flex-col items-center">
                <div className="badge badge-secondary text-xs p-3 mb-2">
                  Unit: {selectedVariant.size}
                </div>
                <div className="badge badge-primary text-xl font-semibold p-3">
                  ${formatPrice(selectedVariant.unitPrice)}
                </div>
              </div>
            )}
          </div>

          {/* Stock and Add to Cart */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            {authState === "authenticated" ? (
              <>
                {isInStock && selectedVariant ? (
                  <>
                    <button
                      className="btn btn-secondary btn-outline col-span-2"
                      onClick={() =>
                        addItem.mutate({
                          productId: product.id,
                          cartId: userCartId!,
                          isUnit: true,
                          variantId: selectedVariant.id, // Pass variant ID
                        })
                      }
                    >
                      Add{" "}
                      {product.apparelType ? product.apparelType.name : "Item"}
                      <FontAwesomeIcon icon={faCartPlus} />
                    </button>
                  </>
                ) : (
                  <div className="col-span-2">
                    <div className="badge badge-error badge-lg w-full py-4">
                      {!selectedVariant ? "Select Options" : "Out of Stock"}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="col-span-2 text-center text-sm">
                Please{" "}
                <Link to="/user/login" className="text-primary hover:underline">
                  sign-in
                </Link>{" "}
                to add product to cart
              </div>
            )}
          </div>

          {/* Stock Count and Variant SKU */}
          {selectedVariant && (
            <div className="text-center space-y-1">
              <div className="text-xs text-gray-500 font-mono">
                Variant: {selectedVariant.sku}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
