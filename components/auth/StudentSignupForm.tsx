"use client";

import { Eye, EyeOff, Github, Globe, GraduationCap, Linkedin, User } from "lucide-react";
import AuthInput from "./AuthInput";

interface StudentFormData {
  fullName: string;
  rollNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  profileUrl: string;
  currentSemester: string;
  cgpa: string;
  bio: string;
}

interface StudentSignupFormProps {
  formData: StudentFormData;
  onChange: (key: string, value: string) => void;
  errors: Record<string, string>;
  showPassword: boolean;
  onTogglePassword: () => void;
}

export default function StudentSignupForm({
  formData,
  onChange,
  errors,
  showPassword,
  onTogglePassword,
}: StudentSignupFormProps) {
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
          label="Roll Number *"
          type="text"
          placeholder="Enter your roll number"
          icon={User}
          value={formData.rollNumber}
          onChange={(e) => onChange("rollNumber", e.target.value)}
          error={errors.rollNumber}
        />

        <AuthInput
          label="Full Name *"
          type="text"
          placeholder="John Kumar Doe"
          icon={User}
          value={formData.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
          error={errors.fullName}
        />

        <AuthInput
          label="Email Address *"
          type="email"
          placeholder="john@mec.ac.in"
          icon={User}
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
          error={errors.email}
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

      {/* Academic Info Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-navy-800 uppercase tracking-wide">
          Academic Details
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <AuthInput
            label="Current Semester"
            type="number"
            placeholder="3"
            icon={GraduationCap}
            value={formData.currentSemester}
            onChange={(e) => onChange("currentSemester", e.target.value)}
            error={errors.currentSemester}
          />

          <AuthInput
            label="CGPA"
            type="number"
            placeholder="8.75"
            step="0.01"
            min="0"
            max="10"
            icon={GraduationCap}
            value={formData.cgpa}
            onChange={(e) => onChange("cgpa", e.target.value)}
            error={errors.cgpa}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-navy-800 mb-1.5 font-sans">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => onChange("bio", e.target.value)}
            placeholder="Passionate about AI and machine learning. Love building web applications."
            rows={3}
            className="input-field resize-none"
          />
          {errors.bio && (
            <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
          )}
        </div>
      </div>

      {/* Social Links Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-navy-800 uppercase tracking-wide">
          Social Profiles (Optional)
        </h3>

        <AuthInput
          label="LinkedIn URL"
          type="url"
          placeholder="https://linkedin.com/in/johndoe"
          icon={Linkedin}
          value={formData.linkedinUrl}
          onChange={(e) => onChange("linkedinUrl", e.target.value)}
          error={errors.linkedinUrl}
        />

        <AuthInput
          label="GitHub URL"
          type="url"
          placeholder="https://github.com/johndoe"
          icon={Github}
          value={formData.githubUrl}
          onChange={(e) => onChange("githubUrl", e.target.value)}
          error={errors.githubUrl}
        />

        <AuthInput
          label="Portfolio URL"
          type="url"
          placeholder="https://johndoe.dev"
          icon={Globe}
          value={formData.portfolioUrl}
          onChange={(e) => onChange("portfolioUrl", e.target.value)}
          error={errors.portfolioUrl}
        />

        <AuthInput
          label="Profile Picture URL"
          type="url"
          placeholder="https://avatars.githubusercontent.com/u/12345"
          icon={User}
          value={formData.profileUrl}
          onChange={(e) => onChange("profileUrl", e.target.value)}
          error={errors.profileUrl}
        />
      </div>
    </div>
  );
}
