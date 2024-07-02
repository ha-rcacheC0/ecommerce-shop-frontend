import { Dispatch, SetStateAction } from "react";
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
import { PageButtons } from "./pageButtons";

interface FilterPanelProps {
  searchTitle: string;
  setSearchTitle: Dispatch<SetStateAction<string>>;
  selectedBrands: Brand[];
  setSelectedBrands: Dispatch<SetStateAction<Brand[]>>;
  selectedCategories: Category[];
  setSelectedCategories: Dispatch<SetStateAction<Category[]>>;
  selectedColors: Colors[];
  setSelectedColors: Dispatch<SetStateAction<Colors[]>>;
  selectedEffects: Effects[];
  setSelectedEffects: Dispatch<SetStateAction<Effects[]>>;
  isFetching: boolean;
  isPlaceholderData: boolean;
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
  hasMore: boolean;
  pageSize: number;
  setPageAmount: Dispatch<SetStateAction<number>>;
}

const FilterPanel = ({
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
  isFetching,
  isPlaceholderData,
  setPage,
  page,
  hasMore,
  pageSize,
  setPageAmount,
}: FilterPanelProps) => {
  const handleCheckboxChange = <T,>(
    setter: Dispatch<SetStateAction<T[]>>,
    value: T
  ) => {
    setter((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  return (
    <div className="drawer drawer-end">
      <input id="filter-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label htmlFor="filter-drawer" className="btn btn-primary m-4">
          Open Filters
        </label>

        <div className="flex flex-wrap justify-center p-4">
          <PageButtons
            isFetching={isFetching}
            isPlaceholderData={isPlaceholderData}
            setPage={setPage}
            page={page}
            hasMore={hasMore}
            pageSize={pageSize}
            setPageAmount={setPageAmount}
          />
        </div>
      </div>
      <div className="drawer-side z-50">
        <label htmlFor="filter-drawer" className="drawer-overlay "></label>
        <div className="menu p-4 w-80 bg-base-100 text-base-content">
          <div className="flex justify-center p-3">
            <input
              type="text"
              placeholder="Filter by title"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
          </div>
          <div className="divider"></div>
          <div className="mb-4">
            <h3 className="font-bold mb-2 text-center">Brands</h3>
            <div className="grid grid-cols-2 gap-1">
              {Object.values(Brand).map((brand) => (
                <label key={brand} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() =>
                      handleCheckboxChange(setSelectedBrands, brand)
                    }
                    className="checkbox checkbox-sm"
                  />
                  <span>{BrandDisplay[brand]}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="divider"></div>
          <div className="mb-4">
            <h3 className="font-bold mb-2 text-center">Categories</h3>
            <div className="grid grid-cols-2 gap-1">
              {Object.values(Category).map((category) => (
                <label key={category} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() =>
                      handleCheckboxChange(setSelectedCategories, category)
                    }
                    className="checkbox checkbox-sm"
                  />
                  <span>{CategoryDisplay[category]}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="divider"></div>
          <div className="mb-4">
            <h3 className="font-bold mb-2 text-center">Colors</h3>
            <div className="grid grid-cols-2 gap-1">
              {Object.values(Colors).map((color) => (
                <label key={color} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedColors.includes(color)}
                    onChange={() =>
                      handleCheckboxChange(setSelectedColors, color)
                    }
                    className="checkbox checkbox-sm"
                  />
                  <span>{ColorsDisplay[color]}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="divider"></div>
          <div className="mb-4">
            <h3 className="font-bold mb-2 text-center">Effects</h3>
            <div className="grid grid-cols-2 gap-1">
              {Object.values(Effects).map((effect) => (
                <label key={effect} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedEffects.includes(effect)}
                    onChange={() =>
                      handleCheckboxChange(setSelectedEffects, effect)
                    }
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
