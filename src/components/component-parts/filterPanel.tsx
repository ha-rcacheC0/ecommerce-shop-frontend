import { useQuery } from "@tanstack/react-query";
import type React from "react";
import { getProductMetadataQueryOptions } from "@/api/metadata/metadataQueries";
import {
	BrandDisplay,
	CategoryDisplay,
	ColorsDisplay,
	EffectsDisplay,
} from "../../types";

interface FilterPanelProps {
	searchTitle: string;
	setSearchTitle: (value: string) => void;
	selectedBrands: string[];
	setSelectedBrands: (brand: string) => void;
	selectedCategories: string[];
	setSelectedCategories: (category: string) => void;
	selectedColors: string[];
	setSelectedColors: (color: string) => void;
	selectedEffects: string[];
	setSelectedEffects: (effect: string) => void;
	isFetching: boolean;
	isPlaceholderData: boolean;
	showOutOfStock: boolean;
	setShowOutOfStock: (value: boolean) => void;
	setPage: React.Dispatch<React.SetStateAction<number>>;
	page: number;
	hasMore: boolean;
	pageSize: number;
	setPageAmount: (value: number) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
	searchTitle,
	setSearchTitle,
	selectedBrands,
	setSelectedBrands,
	selectedCategories,
	setSelectedCategories,
	selectedColors,
	setSelectedColors,
	selectedEffects,
	setSelectedEffects,
	showOutOfStock,
	setShowOutOfStock,
}) => {
	// Use the query options for product metadata
	const { data: metadata, isLoading } = useQuery(
		getProductMetadataQueryOptions(),
	);

	// Use the fetched metadata or empty arrays if still loading
	const availableBrands = metadata?.brands || [];
	const availableCategories = metadata?.categories || [];
	const availableColors = metadata?.colors || [];
	const availableEffects = metadata?.effects || [];

	return (
		<>
			<label
				htmlFor="filter-drawer"
				className="btn btn-primary fixed top-20 left-4 z-40 lg:hidden"
			>
				Open Filters
			</label>

			<div className="drawer h-full lg:p-1 lg:border-r-2 m-2 rounded-md lg:drawer-open max-lg:h-auto drawer-start">
				<input id="filter-drawer" type="checkbox" className="drawer-toggle" />
				<div className="drawer-content"></div>
				<div className="drawer-side z-50">
					<label htmlFor="filter-drawer" className="drawer-overlay"></label>
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
								Categories
							</h3>
							<div className="grid grid-cols-2 gap-1">
								{isLoading ? (
									<div>Loading categories...</div>
								) : (
									availableCategories.map(
										(category: { id: string; name: string }) => (
											<label
												key={category.id}
												className="flex items-center space-x-2"
											>
												<input
													type="checkbox"
													checked={selectedCategories.includes(category.name)}
													onChange={() => setSelectedCategories(category.name)}
													className="checkbox checkbox-sm"
												/>
												<span>
													{CategoryDisplay[category.name] || category.name}
												</span>
											</label>
										),
									)
								)}
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
											<span>{BrandDisplay[brand.name] || brand.name}</span>
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
											<span>{ColorsDisplay[color.name] || color.name}</span>
										</label>
									))
								)}
							</div>
						</div>
						<div className="divider"></div>
						<div className="mb-4">
							<h3 className="font-bold mb-4 text-center text-2xl underline">
								Effects
							</h3>
							<div className="grid grid-cols-2 gap-1">
								{isLoading ? (
									<div>Loading effects...</div>
								) : (
									availableEffects.map(
										(effect: { id: string; name: string }) => (
											<label
												key={effect.id}
												className="flex items-center space-x-2"
											>
												<input
													type="checkbox"
													checked={selectedEffects.includes(effect.name)}
													onChange={() => setSelectedEffects(effect.name)}
													className="checkbox checkbox-sm"
												/>
												<span>
													{EffectsDisplay[effect.name] || effect.name}
												</span>
											</label>
										),
									)
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default FilterPanel;
