import React from "react";
import {
  Brand,
  Category,
  Colors,
  Effects,
  BrandDisplay,
  CategoryDisplay,
  ColorsDisplay,
  EffectsDisplay,
} from "../../types";

interface FilterPanelProps {
  searchTitle: string;
  setSearchTitle: (value: string) => void;
  selectedBrands: Brand[];
  setSelectedBrands: (brand: Brand) => void;
  selectedCategories: Category[];
  setSelectedCategories: (category: Category) => void;
  selectedColors: Colors[];
  setSelectedColors: (color: Colors) => void;
  selectedEffects: Effects[];
  setSelectedEffects: (effect: Effects) => void;
  isFetching: boolean;
  isPlaceholderData: boolean;
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
}) => {
  return (
    <div className="drawer h-full p-1 border-2 m-2 rounded-md lg:drawer-open max-lg:h-auto drawer-start">
      <input id="filter-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label
          htmlFor="filter-drawer"
          className="btn btn-primary m-4 lg:hidden"
        >
          Open Filters
        </label>
      </div>
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
          <div className="divider"></div>
          <div className="mb-4">
            <h3 className="font-bold mb-4 text-center text-2xl underline">
              Categories
            </h3>
            <div className="grid grid-cols-2 gap-1">
              {Object.values(Category).map((category) => (
                <label key={category} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => setSelectedCategories(category)}
                    className="checkbox checkbox-sm"
                  />
                  <span>{CategoryDisplay[category]}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="divider"></div>
          <div className="mb-4">
            <h3 className="font-bold mb-4 text-center text-2xl underline">
              Brands
            </h3>
            <div className="grid grid-cols-2 gap-1">
              {Object.values(Brand).map((brand) => (
                <label key={brand} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => setSelectedBrands(brand)}
                    className="checkbox checkbox-sm"
                  />
                  <span>{BrandDisplay[brand]}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="divider"></div>
          <div className="mb-4">
            <h3 className="font-bold mb-4 text-center text-2xl underline">
              Colors
            </h3>
            <div className="grid grid-cols-2 gap-1">
              {Object.values(Colors).map((color) => (
                <label key={color} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedColors.includes(color)}
                    onChange={() => setSelectedColors(color)}
                    className="checkbox checkbox-sm"
                  />
                  <span>{ColorsDisplay[color]}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="divider"></div>
          <div className="mb-4">
            <h3 className="font-bold mb-4 text-center text-2xl underline">
              Effects
            </h3>
            <div className="grid grid-cols-2 gap-1">
              {Object.values(Effects).map((effect) => (
                <label key={effect} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedEffects.includes(effect)}
                    onChange={() => setSelectedEffects(effect)}
                    className="checkbox checkbox-sm"
                  />
                  <span>{EffectsDisplay[effect]}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
