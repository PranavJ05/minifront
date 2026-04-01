"use client";

import { Search, X } from "lucide-react";
import { AlumniFilters } from "@/types";

// Department codes from backend
const departments = [
  "CS", // Computer Science
  "CSBS", // Computer Science & Business Systems
  "EB", // Electronics & Biomedical
  "EC", // Electronics & Communication
  "EEE", // Electrical & Electronics
  "EV", // Electric Vehicles
  "ME", // Mechanical
];

// Graduation years
const currentYear = new Date().getFullYear();
const graduationYears = Array.from({ length: 50 }, (_, i) => currentYear - i);

interface AlumniFiltersProps {
  filters: AlumniFilters;
  onFilterChange: (filters: AlumniFilters) => void;
}

export default function AlumniFiltersPanel({
  filters,
  onFilterChange,
}: AlumniFiltersProps) {
  const update = (key: string, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearAll = () => {
    onFilterChange({
      search: "",
      batch: "",
      department: "",
    });
  };

  const hasActiveFilters =
    filters.search || filters.batch || filters.department;

  return (
    <div className="space-y-4">
      {/* SEARCH */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or department..."
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
          className="input-field pl-10"
        />
        {filters.search && (
          <button
            onClick={() => update("search", "")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* FILTERS ROW */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* BATCH YEAR */}
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            Batch Year
          </label>
          <select
            value={filters.batch}
            onChange={(e) => update("batch", e.target.value)}
            className="input-field cursor-pointer"
          >
            <option value="">All Batch Years</option>
            {graduationYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* DEPARTMENT */}
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            Department
          </label>
          <select
            value={filters.department}
            onChange={(e) => update("department", e.target.value)}
            className="input-field cursor-pointer"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* CLEAR BUTTON */}
        {hasActiveFilters && (
          <div className="flex items-end">
            <button
              onClick={clearAll}
              className="px-4 py-2.5 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm whitespace-nowrap"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
