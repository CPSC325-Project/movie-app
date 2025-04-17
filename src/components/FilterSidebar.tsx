import { useState } from 'react';
import { Button } from './Button';

type FilterCategory = {
  name: string;
  options: string[];
  expanded: boolean;
};

type FilterSidebarProps = {
  onFilterChange: (filters: Record<string, string[]>) => void;
};

export function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    genres: [],
    decades: [],
  });

  const [categories] = useState<FilterCategory[]>([
    { name: 'Decades', options: ['1970s', '1980s', '1990s', '2000s', '2010s', '2020s'], expanded: false },
    { name: 'Genres', options: ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Drama', 'Horror', 'Fantasy', 'IMAX', 'Sci-Fi', 'Thriller', 'Romance', 'Mystery', 'War'], expanded: false },
  ]);
  
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  

  const toggleCategory = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };
  

  const toggleFilter = (category: string, option: string) => {
    setSelectedFilters((prev) => {
      const categoryKey = category.toLowerCase();
      const updatedFilters = { ...prev };

      if (!updatedFilters[categoryKey]) {
        updatedFilters[categoryKey] = [];
      }

      updatedFilters[categoryKey] = updatedFilters[categoryKey].includes(option)
        ? updatedFilters[categoryKey].filter((item) => item !== option)
        : [...updatedFilters[categoryKey], option];

      onFilterChange(updatedFilters);
      return updatedFilters;
    });
  };

  const clearAllFilters = () => {
    const emptyFilters = Object.keys(selectedFilters).reduce((acc, key) => {
      acc[key] = [];
      return acc;
    }, {} as Record<string, string[]>);

    setSelectedFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const totalFiltersSelected = Object.values(selectedFilters).flat().length;

  return (
    <div className="mt-6 pt-4 overflow-y-auto">
      <h1 className="text-xl font-semibold text-purple-900 px-4 mb-4">Filters</h1>
      
      {totalFiltersSelected > 0 && (
        <div className="p-4">
          <Button
            onClick={clearAllFilters}
            variant="outline"
            className="w-full border-purple-500 text-purple-900"
          >
            Clear All Filters ({totalFiltersSelected})
          </Button>
        </div>
      )}

      <div className="p-4">
        {categories.map((category, index) => (
          <div key={index} className="mb-4">
            <button
              onClick={() => toggleCategory(index)}
              className="flex justify-between items-center w-full text-left font-semibold mb-2 text-purple-600 transition-colors hover:text-purple-800"
            >
              <span>{category.name}</span>
              <span className="text-lg">{expandedIndex === index ? '−' : '+'}</span>
            </button>

            <div
              className={`ml-2 space-y-2 transition-all ${
                expandedIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
              }`}
            >
              {category.options.map((option, optIndex) => {
                const isSelected = selectedFilters[category.name.toLowerCase()]?.includes(option);
                return (
                  <div key={optIndex} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`${category.name}-${optIndex}`}
                      checked={isSelected}
                      onChange={() => toggleFilter(category.name, option)}
                      className="mr-2 h-4 w-4 accent-purple-500"
                    />
                    <label
                      htmlFor={`${category.name}-${optIndex}`}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'text-purple-600 font-bold' : 'text-gray-700'
                      }`}
                    >
                      {option}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}