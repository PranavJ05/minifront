'use client';
// components/alumni/AlumniFilters.tsx
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { AlumniFilters } from '@/types';
import { departments, graduationYears, locations, companies } from '@/lib/mockData';

interface AlumniFiltersProps {
  filters: AlumniFilters;
  onFilterChange: (filters: AlumniFilters) => void;
}

export default function AlumniFiltersPanel({ filters, onFilterChange }: AlumniFiltersProps) {
  const update = (key: keyof AlumniFilters, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearAll = () => {
    onFilterChange({ search: '', batch: '', department: '', company: '', location: '' });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search name, company, or major..."
          value={filters.search}
          onChange={(e) => update('search', e.target.value)}
          className="input-field pl-10"
        />
        {filters.search && (
          <button onClick={() => update('search', '')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filters.batch}
          onChange={(e) => update('batch', e.target.value)}
          className="input-field flex-1 min-w-[150px] cursor-pointer"
        >
          <option value="">All Batches</option>
          {graduationYears.slice(0, 20).map((year) => (
            <option key={year} value={year}>Class of {year}</option>
          ))}
        </select>

        <select
          value={filters.department}
          onChange={(e) => update('department', e.target.value)}
          className="input-field flex-1 min-w-[150px] cursor-pointer"
        >
          {departments.map((dept) => (
            <option key={dept} value={dept === 'All Departments' ? '' : dept}>{dept}</option>
          ))}
        </select>

        <select
          value={filters.company}
          onChange={(e) => update('company', e.target.value)}
          className="input-field flex-1 min-w-[150px] cursor-pointer"
        >
          {companies.map((company) => (
            <option key={company} value={company === 'All Companies' ? '' : company}>{company}</option>
          ))}
        </select>

        <select
          value={filters.location}
          onChange={(e) => update('location', e.target.value)}
          className="input-field flex-1 min-w-[150px] cursor-pointer"
        >
          {locations.map((loc) => (
            <option key={loc} value={loc === 'All Locations' ? '' : loc}>{loc}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
