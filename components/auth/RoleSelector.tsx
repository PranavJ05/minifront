"use client";

import { UserRole } from "@/types";

interface Role {
  value: UserRole;
  label: string;
  icon: string;
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
    icon: "🎓",
    description: "Graduate of the institution",
  },
  {
    value: "student",
    label: "Student",
    icon: "📚",
    description: "Currently enrolled",
  },
];

export default function RoleSelector({
  selectedRole,
  onSelectRole,
}: RoleSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-800 mb-2 font-sans">
        I am a
      </label>
      <div className="grid grid-cols-2 gap-3">
        {roles.map((role) => (
          <button
            key={role.value}
            type="button"
            onClick={() => onSelectRole(role.value)}
            className={`p-4 rounded-lg border-2 text-center transition-all ${
              selectedRole === role.value
                ? "border-navy-800 bg-navy-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="text-2xl mb-1">{role.icon}</div>
            <div className="text-sm font-semibold text-navy-900">
              {role.label}
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5">
              {role.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
