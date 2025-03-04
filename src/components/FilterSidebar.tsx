import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

type FilterCategory = {
  name: string;
  options: string[];
  expanded: boolean;
};

type FilterSidebarProps = {
  onFilterChange: (filters: Record<string, string[]>) => void;
  isOpen: boolean;
  onToggle: () => void;
};

export function FilterSidebar({ onFilterChange, isOpen, onToggle }: FilterSidebarProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    id: [],
    title: [],
    year: [],
    genres: []
  });

  const [categories, setCategories] = useState<FilterCategory[]>([
    {
      name: 'Genres',
      options: ['Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Mystery', 'IMAX'],
      expanded: true,
    },
  ]);

  const toggleCategory = (index: number) => {
    const newCategories = [...categories];
    newCategories[index].expanded = !newCategories[index].expanded;
    setCategories(newCategories);
  };

  const toggleFilter = (category: string, option: string) => {
    const categoryKey = category.toLowerCase();
    const newFilters = { ...selectedFilters };
    
    if (newFilters[categoryKey].includes(option)) {
      newFilters[categoryKey] = newFilters[categoryKey].filter(item => item !== option);
    } else {
      newFilters[categoryKey] = [...newFilters[categoryKey], option];
    }
    
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
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
    <>
      {/* Sidebar */}
      <div className={`fixed top-0 ${isOpen ? 'left-0' : '-left-full'} md:left-0 h-full bg-white text-purple-900 w-64 md:w-72 transition-all duration-300 ease-in-out z-30 overflow-y-auto border-r border-purple-900`}>
        <div className="p-4 border-b border-purple-300 flex justify-between items-center">
          <h2 className="text-xl font-bold">Filter Movies</h2>
          <button 
            onClick={onToggle} 
            className="md:hidden text-purple-900 hover:text-purple-600"
          >
            <X size={24} />
          </button>
        </div>

        {totalFiltersSelected > 0 && (
          <div className="p-4 border-b border-purple-300">
            <Button 
              onClick={clearAllFilters}
              variant="outline" 
              className="w-full border-purple-500 text-purple-900 hover:bg-purple-100"
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
                className="flex justify-between items-center w-full text-left font-semibold mb-2 hover:text-purple-600"
              >
                <span>{category.name}</span>
                <span>{category.expanded ? '−' : '+'}</span>
              </button>
              
              {category.expanded && (
                <div className="ml-2 space-y-2">
                  {category.options.map((option, optIndex) => {
                    const isSelected = selectedFilters[category.name.toLowerCase()].includes(option);
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
                          className={`cursor-pointer ${isSelected ? 'text-purple-600 font-bold' : ''}`}
                        >
                          {option}
                        </label>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}