"use client";

import { Eye, EyeOff, Briefcase, Building2, GraduationCap, Linkedin, User } from "lucide-react";
import AuthInput from "./AuthInput";

interface AlumniFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  linkedinUrl: string;
  currentRole: string;
  company: string;
  phone: string;
}

interface AlumniSignupFormProps {
  formData: AlumniFormData;
  onChange: (key: string, value: string) => void;
  errors: Record<string, string>;
  showPassword: boolean;
  onTogglePassword: () => void;
}

export default function AlumniSignupForm({
  formData,
  onChange,
  errors,
  showPassword,
  onTogglePassword,
}: AlumniSignupFormProps) {
  const passwordStrength = () => {
    const password = formData.password;
    if (!password) return 0;

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strengthColors = [
    "",
    "bg-red-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-green-500",
  ];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strength = passwordStrength();

  return (
    <div className="space-y-4">
      {/* Basic Info Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-navy-800 uppercase tracking-wide">
          Basic Information
        </h3>

        <AuthInput
          label="Full Name *"
          type="text"
          placeholder="John Doe"
          icon={User}
          value={formData.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
          error={errors.fullName}
        />

        <AuthInput
          label="Email Address *"
          type="email"
          placeholder="john@example.com"
          icon={User}
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
          error={errors.email}
        />

        <AuthInput
          label="Phone Number"
          type="tel"
          placeholder="+91 9876543210"
          icon={User}
          value={formData.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          error={errors.phone}
        />
      </div>

      {/* Password Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-navy-800 uppercase tracking-wide">
          Security
        </h3>

        <div>
          <AuthInput
            label="Password *"
            type={showPassword ? "text" : "password"}
            placeholder="Min 8 characters"
            icon={User}
            value={formData.password}
            onChange={(e) => onChange("password", e.target.value)}
            error={errors.password}
            rightElement={
              <button
                type="button"
                onClick={onTogglePassword}
                className="text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
          />
          {formData.password && (
            <div className="mt-1.5 flex items-center gap-2">
              <div className="flex-1 flex gap-1">
                {[1, 2, 3, 4].map((index) => (
                  <div
                    key={index}
                    className={`h-1.5 flex-1 rounded-full ${
                      index <= strength ? strengthColors[strength] : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">
                {strengthLabels[strength]}
              </span>
            </div>
          )}
        </div>

        <AuthInput
          label="Confirm Password *"
          type="password"
          placeholder="Repeat password"
          icon={User}
          value={formData.confirmPassword}
          onChange={(e) => onChange("confirmPassword", e.target.value)}
          error={errors.confirmPassword}
        />
      </div>

      {/* Professional Info Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-navy-800 uppercase tracking-wide">
          Professional Details
        </h3>

        <AuthInput
          label="Current Role"
          type="text"
          placeholder="Software Engineer"
          icon={Briefcase}
          value={formData.currentRole}
          onChange={(e) => onChange("currentRole", e.target.value)}
          error={errors.currentRole}
        />

        <AuthInput
          label="Company"
          type="text"
          placeholder="Google"
          icon={Building2}
          value={formData.company}
          onChange={(e) => onChange("company", e.target.value)}
          error={errors.company}
        />

        <AuthInput
          label="LinkedIn URL"
          type="url"
          placeholder="https://linkedin.com/in/johndoe"
          icon={Linkedin}
          value={formData.linkedinUrl}
          onChange={(e) => onChange("linkedinUrl", e.target.value)}
          error={errors.linkedinUrl}
        />
      </div>
    </div>
  );
}
