"use client";

import { GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AcademicDetailsProps {
  role: "student" | "alumni" | "faculty";
  departments: string[];
  branches: string[];
  batchYears: string[];
  selectedDepartment: string;
  selectedBranch: string;
  selectedBatchYear: string;
  branchDisabled: boolean;
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
  branchDisabled,
  errors,
  onDepartmentChange,
  onBranchChange,
  onBatchYearChange,
}: AcademicDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <GraduationCap className="h-4 w-4 text-muted-foreground/60" />
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Academic Information
        </h3>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Course <span className="text-destructive">*</span>
        </label>
        <Select value={selectedDepartment} onValueChange={(v) => v !== null && onDepartmentChange(v)}>
          <SelectTrigger className="w-full h-9 text-xs bg-muted/30 border-border cursor-pointer">
            <SelectValue placeholder="Select course" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.department && (
          <p className="text-xs text-destructive">{errors.department}</p>
        )}
      </div>

      {(role === "student" || role === "alumni") && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Branch {!branchDisabled && <span className="text-destructive">*</span>}
          </label>
          {branchDisabled ? (
            <Input
              value={selectedBranch}
              disabled
              className="h-9 text-xs bg-muted/30"
            />
          ) : (
            <Select value={selectedBranch} onValueChange={(v) => v !== null && onBranchChange(v)}>
              <SelectTrigger className="w-full h-9 text-xs bg-muted/30 border-border cursor-pointer">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch} value={branch}>
                    {branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {errors.branch && (
            <p className="text-xs text-destructive">{errors.branch}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Year of Graduation <span className="text-destructive">*</span>
        </label>
        <Select value={selectedBatchYear} onValueChange={(v) => v !== null && onBatchYearChange(v)}>
          <SelectTrigger className="w-full h-9 text-xs bg-muted/30 border-border cursor-pointer">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {batchYears.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.batchYear && (
          <p className="text-xs text-destructive">{errors.batchYear}</p>
        )}
      </div>
    </div>
  );
}
