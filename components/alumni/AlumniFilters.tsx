"use client";

import { Search, X } from "lucide-react";
import { AlumniFilters } from "@/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const departments = [
  "CS",
  "CSBS",
  "EB",
  "EC",
  "EEE",
  "EV",
  "ME",
];

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
    onFilterChange({ search: "", batch: "", department: "" });
  };

  const hasActiveFilters =
    filters.search || filters.batch || filters.department;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by name or department..."
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
          className="pl-10"
        />
        {filters.search && (
          <button
            onClick={() => update("search", "")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
            Batch Year
          </label>
          <Select
            value={filters.batch}
            onValueChange={(v) => update("batch", v ?? "")}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Batch Years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Batch Years</SelectItem>
              {graduationYears.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
            Department
          </label>
          <Select
            value={filters.department}
            onValueChange={(v) => update("department", v ?? "")}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <div className="flex items-end">
            <Button
              onClick={clearAll}
              variant="outline"
              size="sm"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
