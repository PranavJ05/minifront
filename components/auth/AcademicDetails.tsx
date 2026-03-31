"use client";

import { GraduationCap } from "lucide-react";

interface AcademicDetailsProps {
  role: "student" | "alumni";
  departments: string[];
  branches: string[];
  batchYears: string[];
  selectedDepartment: string;
  selectedBranch: string;
  selectedBatchYear: string;
  errors: Record<string, string>;
  onDepartmentChange: (value: string) => void;
  onBranchChange: (value: string) => void;
  onBatchYearChange: (value: string) => void;
}

export default function AcademicDetails({
  role,
  departments,
  branches,
  batchYears,
  selectedDepartment,
  selectedBranch,
  selectedBatchYear,
  errors,
  onDepartmentChange,
  onBranchChange,
  onBatchYearChange,
}: AcademicDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <GraduationCap className="h-4 w-4 text-navy-600" />
        <h3 className="text-sm font-semibold text-navy-800 uppercase tracking-wide">
          Academic Information
        </h3>
      </div>

      {/* Department */}
      <div>
        <label className="block text-sm font-medium text-navy-800 mb-1.5 font-sans">
          Department *
        </label>
        <select
          value={selectedDepartment}
          onChange={(e) => onDepartmentChange(e.target.value)}
          className="input-field cursor-pointer"
        >
          <option value="">Select department</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        {errors.department && (
          <p className="mt-1 text-sm text-red-600">{errors.department}</p>
        )}
      </div>

      {/* Branch - Only for students and alumni */}
      {(role === "student" || role === "alumni") && (
        <div>
          <label className="block text-sm font-medium text-navy-800 mb-1.5 font-sans">
            Branch *
          </label>
          <select
            value={selectedBranch}
            onChange={(e) => onBranchChange(e.target.value)}
            className="input-field cursor-pointer"
          >
            <option value="">Select branch</option>
            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
          {errors.branch && (
            <p className="mt-1 text-sm text-red-600">{errors.branch}</p>
          )}
        </div>
      )}

      {/* Batch Year */}
      <div>
        <label className="block text-sm font-medium text-navy-800 mb-1.5 font-sans">
          {role === "student" ? "Expected Graduation Year *" : "Batch Year *"}
        </label>
        <select
          value={selectedBatchYear}
          onChange={(e) => onBatchYearChange(e.target.value)}
          className="input-field cursor-pointer"
        >
          <option value="">Select year</option>
          {batchYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        {errors.batchYear && (
          <p className="mt-1 text-sm text-red-600">{errors.batchYear}</p>
        )}
      </div>
    </div>
  );
}
