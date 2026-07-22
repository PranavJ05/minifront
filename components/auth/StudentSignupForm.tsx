"use client";

import { Eye, EyeOff, Phone, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface StudentFormData {
  fullName: string;
  rollNumber: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
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
    "bg-destructive",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-emerald-500",
  ];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strength = passwordStrength();

  const inputIconClass =
    "absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60 pointer-events-none";

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Basic Information
        </h3>

        <div className="space-y-2">
          <Label htmlFor="rollNumber">
            Roll Number <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <User className={inputIconClass} />
            <Input
              id="rollNumber"
              className="pl-8"
              placeholder="MDL23CS201"
              value={formData.rollNumber}
              onChange={(e) => onChange("rollNumber", e.target.value)}
            />
          </div>
          {errors.rollNumber && (
            <p className="text-xs text-destructive">{errors.rollNumber}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullName">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <User className={inputIconClass} />
            <Input
              id="fullName"
              className="pl-8"
              value={formData.fullName}
              onChange={(e) => onChange("fullName", e.target.value)}
            />
          </div>
          {errors.fullName && (
            <p className="text-xs text-destructive">{errors.fullName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone <span className="text-muted-foreground/60">(optional)</span>
          </Label>
          <div className="relative">
            <Phone className={inputIconClass} />
            <Input
              id="phone"
              type="tel"
              className="pl-8"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => onChange("phone", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email Address (.mec mail) <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <User className={inputIconClass} />
            <Input
              id="email"
              type="email"
              className="pl-8"
              placeholder="name.mec@gmail.com"
              value={formData.email}
              onChange={(e) => onChange("email", e.target.value)}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Security
        </h3>

        <div className="space-y-2">
          <Label htmlFor="password">
            Password <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <User className={inputIconClass} />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              className="pl-8 pr-10"
              placeholder="Min 8 characters"
              value={formData.password}
              onChange={(e) => onChange("password", e.target.value)}
            />
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {formData.password && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 flex gap-1">
                {[1, 2, 3, 4].map((index) => (
                  <div
                    key={index}
                    className={`h-1.5 flex-1 rounded-full ${
                      index <= strength
                        ? strengthColors[strength]
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {strengthLabels[strength]}
              </span>
            </div>
          )}
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">
            Confirm Password <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <User className={inputIconClass} />
            <Input
              id="confirmPassword"
              type="password"
              className="pl-8"
              placeholder="Repeat password"
              value={formData.confirmPassword}
              onChange={(e) => onChange("confirmPassword", e.target.value)}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">
              {errors.confirmPassword}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
