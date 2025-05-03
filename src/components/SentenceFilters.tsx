'use client';

interface SentenceFiltersProps {
  onFilterChange: (filters: { difficulty: string[]; search: string }) => void;
}

export default function SentenceFilters({ onFilterChange }: SentenceFiltersProps) {
  const handleDifficultyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checkboxes = document.querySelectorAll<HTMLInputElement>('input[name="difficulty"]');
    const selectedValues = Array.from(checkboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value);
    
    const searchInput = document.querySelector<HTMLInputElement>('input[name="search"]');
    onFilterChange({
      difficulty: selectedValues,
      search: searchInput?.value || ''
    });
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checkboxes = document.querySelectorAll<HTMLInputElement>('input[name="difficulty"]');
    const selectedValues = Array.from(checkboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value);
    
    onFilterChange({
      difficulty: selectedValues,
      search: e.target.value
    });
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <h3 className="text-lg font-medium mb-4">筛选条件</h3>
      
      <div className="mb-4">
        <div className="font-medium mb-2">难度</div>
        <div className="flex flex-wrap gap-4">
          <label className="inline-flex items-center">
            <input 
              type="checkbox" 
              name="difficulty" 
              value="beginner"
              defaultChecked
              onChange={handleDifficultyChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm">初级</span>
          </label>
          
          <label className="inline-flex items-center">
            <input 
              type="checkbox" 
              name="difficulty" 
              value="intermediate"
              defaultChecked
              onChange={handleDifficultyChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm">中级</span>
          </label>
          
          <label className="inline-flex items-center">
            <input 
              type="checkbox" 
              name="difficulty" 
              value="advanced"
              defaultChecked
              onChange={handleDifficultyChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm">高级</span>
          </label>
        </div>
      </div>
      
      <div>
        <label htmlFor="search" className="font-medium mb-2 block">搜索</label>
        <input
          type="text"
          id="search"
          name="search"
          placeholder="输入关键词搜索句子..."
          onChange={handleSearchChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
} 