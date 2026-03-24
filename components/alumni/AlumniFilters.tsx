'use client';

import { Search, X } from 'lucide-react';
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
    onFilterChange({
      search: '',
      batch: '',
      department: '',
      company: '',
      location: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="space-y-4">

      {/* SEARCH */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search name, department..."
          value={filters.search}
          onChange={(e) => update('search', e.target.value)}
          className="input-field pl-10"
        />
        {filters.search && (
          <button
            onClick={() => update('search', '')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3">

        {/* BATCH */}
        <select
          value={filters.batch}
          onChange={(e) => update('batch', e.target.value)}
          className="input-field flex-1 min-w-[150px]"
        >
          <option value="">All Batches</option>
          {graduationYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        {/* DEPARTMENT */}
        <select
          value={filters.department}
          onChange={(e) => update('department', e.target.value)}
          className="input-field flex-1 min-w-[150px]"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {/* COMPANY */}
        <select
          value={filters.company}
          onChange={(e) => update('company', e.target.value)}
          className="input-field flex-1 min-w-[150px]"
        >
          <option value="">All Companies</option>
          {companies.map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>

        {/* LOCATION */}
        <select
          value={filters.location}
          onChange={(e) => update('location', e.target.value)}
          className="input-field flex-1 min-w-[150px]"
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="px-4 py-2 text-red-600 border border-red-300 rounded"
          >
            Clear
          </button>
        )}

      </div>
    </div>
  );
}