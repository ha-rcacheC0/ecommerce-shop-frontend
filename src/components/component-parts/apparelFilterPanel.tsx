// @components/component-parts/apparelFilterPanel.tsx

import { useQuery } from "@tanstack/react-query";
import type React from "react";
import { getProductMetadataQueryOptions } from "@/api/metadata/metadataQueries";
import { type ApparelFilter, BrandDisplay, ColorsDisplay } from "@/types";

export const ApparelFilterPanel: React.FC<ApparelFilter> = ({
	searchTitle,
	setSearchTitle,
	selectedBrands,
	setSelectedBrands,
	selectedColors,
	setSelectedColors,
	selectedApparelTypes,
	setSelectedApparelTypes,
	selectedGenders,
	setSelectedGenders,
	selectedSizes,
	setSelectedSizes,
	showOutOfStock,
	setShowOutOfStock,
}) => {
	// Use the same query pattern as FilterPanel
	const { data: metadata, isLoading } = useQuery(
		getProductMetadataQueryOptions(),
	);

	// Use the fetched metadata or empty arrays if still loading
	const availableBrands = metadata?.brands || [];

	const availableColors = metadata?.colors || [];
	const availableApparelTypes = metadata?.apparelTypes || [];

	// Static data for genders and sizes (since these aren't in your current metadata API)
	const availableGenders = [
		{ id: "MALE", name: "MALE" },
		{ id: "FEMALE", name: "FEMALE" },
		{ id: "UNISEX", name: "UNISEX" },
	];

	const availableSizes = [
		{ id: "XS", name: "XS" },
		{ id: "S", name: "S" },
		{ id: "M", name: "M" },
		{ id: "L", name: "L" },
		{ id: "XL", name: "XL" },
		{ id: "2XL", name: "2XL" },
		{ id: "3XL", name: "3XL" },
	];

	// const clearAllFilters = () => {
	//   setSearchTitle("");
	//   setSelectedBrands([]);
	//   setSelectedColors([]);
	//   setSelectedApparelTypes([]);
	//   setSelectedGenders([]);
	//   setSelectedSizes([]);
	//   setShowOutOfStock(false);
	//   setPage(1);
	// };

	return (
		<>
			<label
				htmlFor="apparel-filter-drawer"
				className="btn btn-primary fixed top-20 left-4 z-40 lg:hidden"
			>
				Open Filters
			</label>

			<div className="drawer h-full lg:p-1 lg:border-r-2 m-2 rounded-md lg:drawer-open max-lg:h-auto drawer-start">
				<input
					id="apparel-filter-drawer"
					type="checkbox"
					className="drawer-toggle"
				/>
				<div className="drawer-content"></div>
				<div className="drawer-side z-50">
					<label
						htmlFor="apparel-filter-drawer"
						className="drawer-overlay"
					></label>
					<div className="menu p-4 w-80 bg-base-100 text-base-content">
						<div className="flex justify-center p-3 rounded-2xl">
							<input
								type="text"
								placeholder="Search..."
								value={searchTitle}
								onChange={(e) => setSearchTitle(e.target.value)}
								className="input input-bordered w-full max-w-xs"
							/>
						</div>

						<div className="mb-4 mt-4">
							<h3 className="font-bold mb-2 text-center text-xl underline">
								Availability
							</h3>
							<div className="flex items-center">
								<input
									type="checkbox"
									id="showOutOfStock"
									className="checkbox checkbox-sm"
									checked={showOutOfStock}
									onChange={(e) => setShowOutOfStock(e.target.checked)}
								/>
								<label htmlFor="showOutOfStock" className="ml-2">
									Show out-of-stock products
								</label>
							</div>
						</div>

						<div className="divider"></div>

						<div className="mb-4">
							<h3 className="font-bold mb-4 text-center text-2xl underline">
								Brands
							</h3>
							<div className="grid grid-cols-2 gap-1">
								{isLoading ? (
									<div>Loading brands...</div>
								) : (
									availableBrands.map((brand: { id: string; name: string }) => (
										<label
											key={brand.id}
											className="flex items-center space-x-2"
										>
											<input
												type="checkbox"
												checked={selectedBrands.includes(brand.name)}
												onChange={() => setSelectedBrands(brand.name)}
												className="checkbox checkbox-sm"
											/>
											<span className="text-xs">
												{BrandDisplay[brand.name] || brand.name}
											</span>
										</label>
									))
								)}
							</div>
						</div>

						<div className="divider"></div>

						<div className="mb-4">
							<h3 className="font-bold mb-4 text-center text-2xl underline">
								Colors
							</h3>
							<div className="grid grid-cols-2 gap-1">
								{isLoading ? (
									<div>Loading colors...</div>
								) : (
									availableColors.map((color: { id: string; name: string }) => (
										<label
											key={color.id}
											className="flex items-center space-x-2"
										>
											<input
												type="checkbox"
												checked={selectedColors.includes(color.name)}
												onChange={() => setSelectedColors(color.name)}
												className="checkbox checkbox-sm"
											/>
											<span className="text-xs">
												{ColorsDisplay[color.name] || color.name}
											</span>
										</label>
									))
								)}
							</div>
						</div>

						<div className="divider"></div>

						<div className="mb-4">
							<h3 className="font-bold mb-4 text-center text-2xl underline">
								Apparel Types
							</h3>
							<div className="grid grid-cols-2 gap-1">
								{isLoading ? (
									<div>Loading apparel types...</div>
								) : (
									availableApparelTypes.map(
										(apparelType: { id: string; name: string }) => (
											<label
												key={apparelType.id}
												className="flex items-center space-x-2"
											>
												<input
													type="checkbox"
													checked={selectedApparelTypes.includes(
														apparelType.name,
													)}
													onChange={() =>
														setSelectedApparelTypes(apparelType.name)
													}
													className="checkbox checkbox-sm"
												/>
												<span className="text-xs">{apparelType.name}</span>
											</label>
										),
									)
								)}
							</div>
						</div>

						<div className="divider"></div>

						<div className="mb-4">
							<h3 className="font-bold mb-4 text-center text-2xl underline">
								Genders
							</h3>
							<div className="grid grid-cols-1 gap-1">
								{availableGenders.map(
									(gender: { id: string; name: string }) => (
										<label
											key={gender.id}
											className="flex items-center space-x-2"
										>
											<input
												type="checkbox"
												checked={selectedGenders.includes(gender.name)}
												onChange={() => setSelectedGenders(gender.name)}
												className="checkbox checkbox-sm"
											/>
											<span className="text-xs">{gender.name}</span>
										</label>
									),
								)}
							</div>
						</div>

						<div className="divider"></div>

						<div className="mb-4">
							<h3 className="font-bold mb-4 text-center text-2xl underline">
								Sizes
							</h3>
							<div className="grid grid-cols-3 gap-1">
								{availableSizes.map((size: { id: string; name: string }) => (
									<label key={size.id} className="flex items-center space-x-2">
										<input
											type="checkbox"
											checked={selectedSizes.includes(size.name)}
											onChange={() => setSelectedSizes(size.name)}
											className="checkbox checkbox-sm"
										/>
										<span className="text-xs">{size.name}</span>
									</label>
								))}
							</div>
						</div>

						<div className="divider"></div>

						{/* Clear All Filters Button */}
						{/* <div className="mb-4">
              <button
                onClick={clearAllFilters}
                className="btn btn-outline w-full"
              >
                Clear All Filters
              </button>
            </div> */}
					</div>
				</div>
			</div>
		</>
	);
};
