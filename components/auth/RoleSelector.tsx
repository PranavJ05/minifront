"use client";

import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";

interface Role {
  value: UserRole;
  label: string;
  description: string;
}

interface RoleSelectorProps {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

const roles: Role[] = [
  {
    value: "alumni",
    label: "Alumni",
    description: "Graduate of the institution",
  },
  {
    value: "student",
    label: "Student",
    description: "Currently enrolled",
  },
  {
    value: "faculty",
    label: "Faculty",
    description: "Faculty member",
  },
];

export default function RoleSelector({
  selectedRole,
  onSelectRole,
}: RoleSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        I am a
      </label>
      <div className="grid grid-cols-3 gap-2">
        {roles.map((role) => (
          <Button
            key={role.value}
            type="button"
            variant={selectedRole === role.value ? "secondary" : "outline"}
            onClick={() => onSelectRole(role.value)}
            className="flex-col gap-0.5 h-auto py-3 px-2 cursor-pointer"
          >
            <span className="text-sm font-semibold">{role.label}</span>
            <span className="text-[10px] text-muted-foreground font-normal">
              {role.description}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
