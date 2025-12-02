// Material options for filtering and form
export const MATERIALS = [
  'All',
  'Plastic',
  'Glass',
  'Paper',
  'Fabric',
  'Metal',
  'Organic',
  'Wood',
  'Rubber',
  'Ceramic',
  'Electronics'
];

export const SORT_OPTIONS = [
  { value: 'date', label: 'Latest' },
  { value: 'score', label: 'Highest Score' },
  { value: 'ideas', label: 'Most Ideas' },
];

// Material color mapping for badges
export const MATERIAL_COLORS = {
  Plastic: 'bg-blue-100 text-blue-700 border-blue-200',
  Glass: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  Paper: 'bg-amber-100 text-amber-700 border-amber-200',
  Fabric: 'bg-purple-100 text-purple-700 border-purple-200',
  Metal: 'bg-gray-100 text-gray-700 border-gray-200',
  Organic: 'bg-green-100 text-green-700 border-green-200',
  Wood: 'bg-orange-100 text-orange-700 border-orange-200',
  Rubber: 'bg-rose-100 text-rose-700 border-rose-200',
  Ceramic: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Electronics: 'bg-violet-100 text-violet-700 border-violet-200',
};

// Default pagination state
export const DEFAULT_PAGINATION = {
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 6,
  hasNextPage: false,
  hasPrevPage: false,
};
