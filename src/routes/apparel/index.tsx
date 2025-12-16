// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { getAllApparelQueryOptions } from "@api/apparel/apparelQueries";
import { ApparelProductCard } from "@components/apparelProductCard";
import { PageButtons } from "@components/component-parts/pageButtons";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { ApparelFilterPanel } from "@/components/component-parts/apparelFilterPanel";
import type { TProduct } from "@/types";
import { logger } from "@/utils/logger";

const ApparelProducts: React.FC = () => {
	const navigate = useNavigate();
	const search = Route.useSearch();

	// State management for filters
	const [selectedBrands, setSelectedBrands] = useState<string[]>(() =>
		Array.isArray(search.brands)
			? search.brands.filter(Boolean)
			: typeof search.brands === "string"
				? search.brands.split(",").filter(Boolean)
				: [],
	);
	const [selectedCategories, setSelectedCategories] = useState<string[]>(() =>
		Array.isArray(search.categories)
			? search.categories.filter(Boolean)
			: typeof search.categories === "string"
				? search.categories.split(",").filter(Boolean)
				: [],
	);
	const [selectedColors, setSelectedColors] = useState<string[]>(() =>
		Array.isArray(search.colors)
			? search.colors.filter(Boolean)
			: typeof search.colors === "string"
				? search.colors.split(",").filter(Boolean)
				: [],
	);
	const [selectedApparelTypes, setSelectedApparelTypes] = useState<string[]>(
		() =>
			Array.isArray(search.apparelTypes)
				? search.apparelTypes.filter(Boolean)
				: typeof search.apparelTypes === "string"
					? search.apparelTypes.split(",").filter(Boolean)
					: [],
	);
	const [selectedGenders, setSelectedGenders] = useState<string[]>(() =>
		Array.isArray(search.genders)
			? search.genders.filter(Boolean)
			: typeof search.genders === "string"
				? search.genders.split(",").filter(Boolean)
				: [],
	);
	const [selectedSizes, setSelectedSizes] = useState<string[]>(() =>
		Array.isArray(search.sizes)
			? search.sizes.filter(Boolean)
			: typeof search.sizes === "string"
				? search.sizes.split(",").filter(Boolean)
				: [],
	);

	const [page, setPage] = useState(() => Number(search.page) || 1);
	const [pageSize, setPageSize] = useState(() => Number(search.pageSize) || 25);
	const [searchTitle, setSearchTitle] = useState(search.searchTitle || "");
	const [showOutOfStock, setShowOutOfStock] = useState(
		search.showOutOfStock === "true",
	);

	const {
		data: apparelProducts,
		isPending,
		isError,
		error,
		isFetching,
		isPlaceholderData,
	} = useQuery(
		getAllApparelQueryOptions({
			page,
			pageSize,
			selectedBrands,
			selectedCategories,
			selectedColors,
			selectedApparelTypes,
			selectedGenders,
			selectedSizes,
			searchTitle,
			inStock: showOutOfStock ? undefined : true,
		}),
	);
	logger.debug(
		{ count: apparelProducts?.totalCount },
		"Apparel Products loaded",
	);

	const updateUrl = useCallback(() => {
		const searchParams: Record<string, string | string[]> = {
			page: page.toString(),
			pageSize: pageSize.toString(),
		};

		if (searchTitle) searchParams.searchTitle = searchTitle;
		if (selectedBrands.length > 0) searchParams.brands = selectedBrands;
		if (selectedCategories.length > 0)
			searchParams.categories = selectedCategories;
		if (selectedColors.length > 0) searchParams.colors = selectedColors;
		if (selectedApparelTypes.length > 0)
			searchParams.apparelTypes = selectedApparelTypes;
		if (selectedGenders.length > 0) searchParams.genders = selectedGenders;
		if (selectedSizes.length > 0) searchParams.sizes = selectedSizes;
		if (showOutOfStock) searchParams.showOutOfStock = "true";

		navigate({
			search: () => {
				// Start with a fresh object to avoid carrying over old filter values
				const newSearch: Record<string, string | string[]> = {
					page: searchParams.page,
					pageSize: searchParams.pageSize,
				};

				// Only add filters that are present in the current searchParams
				if ("searchTitle" in searchParams)
					newSearch.searchTitle = searchParams.searchTitle;
				if ("brands" in searchParams) newSearch.brands = searchParams.brands;
				if ("categories" in searchParams)
					newSearch.categories = searchParams.categories;
				if ("colors" in searchParams) newSearch.colors = searchParams.colors;
				if ("apparelTypes" in searchParams)
					newSearch.apparelTypes = searchParams.apparelTypes;
				if ("genders" in searchParams) newSearch.genders = searchParams.genders;
				if ("sizes" in searchParams) newSearch.sizes = searchParams.sizes;
				if ("showOutOfStock" in searchParams)
					newSearch.showOutOfStock = searchParams.showOutOfStock;

				return newSearch;
			},
			replace: true,
		});
	}, [
		navigate,
		page,
		pageSize,
		selectedBrands,
		selectedCategories,
		selectedColors,
		selectedApparelTypes,
		selectedGenders,
		selectedSizes,
		searchTitle,
		showOutOfStock,
	]);

	const handleFilterChange = useCallback(
		<T extends string>(
			setter: React.Dispatch<React.SetStateAction<T[]>>,
			value: T,
		) => {
			setter((prev) => {
				const newValues = prev.includes(value)
					? prev.filter((item) => item !== value)
					: [...prev, value];
				setPage(1); // Reset to first page when filter changes
				return newValues;
			});
		},
		[],
	);

	useEffect(() => {
		updateUrl();
	}, [updateUrl]);

	if (isPending) return <div>Loading...</div>;
	if (isError) return <div>Error: {error.message}</div>;

	return (
		<div className="flex min-h-screen max-lg:flex-col max-lg:items-center">
			<div className="flex-shrink-0 max-lg:w-full">
				<ApparelFilterPanel
					searchTitle={searchTitle}
					setSearchTitle={(value) => {
						setSearchTitle(value);
						setPage(1);
					}}
					selectedBrands={selectedBrands}
					setSelectedBrands={(brand: string) =>
						handleFilterChange(setSelectedBrands, brand)
					}
					selectedCategories={selectedCategories}
					setSelectedCategories={(category: string) =>
						handleFilterChange(setSelectedCategories, category)
					}
					selectedColors={selectedColors}
					setSelectedColors={(color: string) =>
						handleFilterChange(setSelectedColors, color)
					}
					selectedApparelTypes={selectedApparelTypes}
					setSelectedApparelTypes={(apparelType: string) =>
						handleFilterChange(setSelectedApparelTypes, apparelType)
					}
					selectedGenders={selectedGenders}
					setSelectedGenders={(gender: string) =>
						handleFilterChange(setSelectedGenders, gender)
					}
					selectedSizes={selectedSizes}
					setSelectedSizes={(size: string) =>
						handleFilterChange(setSelectedSizes, size)
					}
					showOutOfStock={showOutOfStock}
					setShowOutOfStock={(value) => {
						setShowOutOfStock(value);
						setPage(1);
					}}
					isFetching={isFetching}
					isPlaceholderData={isPlaceholderData}
					setPage={setPage}
					page={page}
					hasMore={apparelProducts?.hasMore ?? false}
					pageSize={pageSize}
					setPageAmount={(value) => {
						setPageSize(value);
						setPage(1);
					}}
				/>
			</div>

			<div className="flex flex-col sm:p-4 flex-1">
				<div className="bg-base-100 sm:p-4">
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:p-4">
						{apparelProducts?.contents.map((product: TProduct) => (
							<ApparelProductCard
								key={product.id}
								product={product}
								searchParams={search}
							/>
						))}
					</div>
				</div>

				<div className="bg-base-100 lg:p-4">
					<PageButtons
						isFetching={isFetching}
						isPlaceholderData={isPlaceholderData}
						setPage={setPage}
						page={page}
						hasMore={apparelProducts?.hasMore ?? false}
						pageSize={pageSize}
						setPageAmount={(value) => {
							setPageSize(value);
							setPage(1);
						}}
					/>
				</div>
			</div>
			{isFetching && <div>Fetching...</div>}
		</div>
	);
};

export const Route = createFileRoute("/apparel/")({
	component: ApparelProducts,
	validateSearch: z.object({
		page: z.coerce.number().optional().default(1),
		pageSize: z.coerce.number().optional().default(25),
		brands: z.union([z.string(), z.array(z.string())]).optional(),
		categories: z.union([z.string(), z.array(z.string())]).optional(),
		colors: z.union([z.string(), z.array(z.string())]).optional(),
		apparelTypes: z.union([z.string(), z.array(z.string())]).optional(),
		genders: z.union([z.string(), z.array(z.string())]).optional(),
		sizes: z.union([z.string(), z.array(z.string())]).optional(),
		searchTitle: z.string().optional(),
		showOutOfStock: z.enum(["true", "false"]).optional(),
	}),
	loaderDeps: ({ search }) => search,
	loader: ({ context: { queryClient }, deps }) => {
		const page = Number(deps.page) || 1;
		const pageSize = Number(deps.pageSize) || 25;
		const selectedBrands = Array.isArray(deps.brands)
			? deps.brands.filter(Boolean)
			: typeof deps.brands === "string"
				? deps.brands.split(",").filter(Boolean)
				: [];
		const selectedCategories = Array.isArray(deps.categories)
			? deps.categories.filter(Boolean)
			: typeof deps.categories === "string"
				? deps.categories.split(",").filter(Boolean)
				: [];
		const selectedColors = Array.isArray(deps.colors)
			? deps.colors.filter(Boolean)
			: typeof deps.colors === "string"
				? deps.colors.split(",").filter(Boolean)
				: [];
		const selectedApparelTypes = Array.isArray(deps.apparelTypes)
			? deps.apparelTypes.filter(Boolean)
			: typeof deps.apparelTypes === "string"
				? deps.apparelTypes.split(",").filter(Boolean)
				: [];
		const selectedGenders = Array.isArray(deps.genders)
			? deps.genders.filter(Boolean)
			: typeof deps.genders === "string"
				? deps.genders.split(",").filter(Boolean)
				: [];
		const selectedSizes = Array.isArray(deps.sizes)
			? deps.sizes.filter(Boolean)
			: typeof deps.sizes === "string"
				? deps.sizes.split(",").filter(Boolean)
				: [];
		const searchTitle = deps.searchTitle || "";
		const showOutOfStock = deps.showOutOfStock === "true";

		return queryClient.ensureQueryData(
			getAllApparelQueryOptions({
				page,
				pageSize,
				selectedBrands,
				selectedCategories,
				selectedColors,
				selectedApparelTypes,
				selectedGenders,
				selectedSizes,
				searchTitle,
				inStock: showOutOfStock ? undefined : true,
			}),
		);
	},
});
