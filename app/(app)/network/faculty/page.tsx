"use client";

import { useState } from "react";
import { Search, Users, Mail, Building2, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFacultyQuery, type FacultyProfile } from "@/hooks/queries/faculty";

export default function NetworkFacultyPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");

  const queryParams: Record<string, string> = {};
  if (searchTerm) queryParams.search = searchTerm;
  if (selectedDept !== "all") queryParams.department = selectedDept;

  const { data: facultyList = [], isLoading } = useFacultyQuery(queryParams);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <Users className="h-3.5 w-3.5 mr-1 text-primary" /> Academic Staff
            </Badge>
            <span className="text-xs text-muted-foreground">Network / Faculty</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1">
            Faculty Directory
          </h1>
          <p className="text-xs text-muted-foreground">
            Connect with professors, instructors, and department heads across Model Engineering College.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 bg-card/60 backdrop-blur-xs border-border">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              placeholder="Search faculty by name, designation, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <div className="sm:col-span-4">
            <Select value={selectedDept} onValueChange={(val) => setSelectedDept(val || "all")}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="CS">Computer Science & Engineering</SelectItem>
                <SelectItem value="EC">Electronics & Communication</SelectItem>
                <SelectItem value="EEE">Electrical & Electronics</SelectItem>
                <SelectItem value="EB">Electronics & Biomedical</SelectItem>
                <SelectItem value="ME">Mechanical Engineering</SelectItem>
                <SelectItem value="BS">Basic Sciences & Humanities</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Faculty Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-xs">Loading faculty members...</p>
        </div>
      ) : facultyList.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <CardContent className="p-0 flex flex-col items-center gap-2">
            <Users className="h-8 w-8 text-muted-foreground/40" />
            <h3 className="font-semibold text-sm text-foreground">No Faculty Members Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              Try adjusting your search criteria or resetting department filters.
            </p>
            <Button
              variant="outline"
              size="xs"
              onClick={() => {
                setSearchTerm("");
                setSelectedDept("all");
              }}
              className="mt-2 cursor-pointer"
            >
              Reset Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facultyList.map((member: FacultyProfile) => {
            const initial = member.name ? member.name.charAt(0).toUpperCase() : "F";
            return (
              <Card
                key={member.userId || member.email}
                className="group border-border hover:border-primary/40 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between"
              >
                <CardContent className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base border border-primary/20 shrink-0">
                        {member.profileImageUrl ? (
                          <img
                            src={member.profileImageUrl}
                            alt={member.name}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          initial
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                          {member.name}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                          <User className="h-3 w-3 shrink-0" />
                          {member.designation || "Faculty Member"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(member.department || member.departmentCode) && (
                        <Badge variant="secondary" className="font-normal text-[11px]">
                          <Building2 className="h-3 w-3 mr-1 text-primary" />
                          {member.department || member.departmentCode}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50 flex items-center justify-between gap-2 mt-4">
                    {member.email ? (
                      <Button variant="outline" size="xs" asChild className="w-full justify-center cursor-pointer">
                        <a href={`mailto:${member.email}`}>
                          <Mail className="h-3.5 w-3.5 mr-1.5" /> Email Faculty
                        </a>
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">Contact info unavailable</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
