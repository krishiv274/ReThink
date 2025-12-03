'use client';

import { Search } from 'lucide-react';
import { MATERIALS, SORT_OPTIONS } from './constants';

export default function ItemsFilters({ 
  searchQuery, 
  onSearchChange, 
  selectedMaterial, 
  onMaterialChange, 
  sortBy, 
  onSortChange 
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all"
        />
      </div>
      
      <div className="flex gap-2">
        <select
          value={selectedMaterial}
          onChange={(e) => onMaterialChange(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all bg-white"
        >
          {MATERIALS.map(mat => (
            <option key={mat} value={mat}>{mat}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all bg-white"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
