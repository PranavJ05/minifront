"use client";
// app/auth/signup/page.tsx
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Linkedin,
  CheckCircle,
  MapPin,
  Briefcase,
  Calendar,
} from "lucide-react";
import AuthInput from "@/components/auth/AuthInput";
import { UserRole } from "@/types";
import { departments } from "@/lib/mockData";

// Batch years from 1980 up to 2050
const batchYears = Array.from({ length: 71 }, (_, i) => String(1980 + i));

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "alumni" as UserRole,
    department: "",
    graduationYear: "",
    phone: "",
    linkedin: "",
    // new fields
    place: "",
    profession: "",
    batchYear: "",
    gmail: "",
  });

  const update = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!formData.fullName.trim()) e.fullName = "Full name is required";
    if (!formData.email.includes("@")) e.email = "Valid email required";
    if (formData.password !== formData.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!formData.department) e.department = "Department is required";
    if (!formData.batchYear) e.batchYear = "Batch year is required";
    if (!formData.place.trim()) e.place = "Place is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setLoading(true);

    try {
      const payload = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        batchYear: parseInt(formData.batchYear),
        department: formData.department,
        placeOfResidence: formData.place,
        profession: formData.profession,
        gmail: formData.gmail,
        linkedinUrl: formData.linkedin,
      };

      const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Registration failed");
      }

      const data = await res.json();
      console.log("Registered User Response:", data);

      // Store pending status; approval must come from admin
      const pendingUser = {
        id: Date.now().toString(),
        email: data.email,
        fullName: data.name,
        role: formData.role,
        department: formData.department,
        batchYear: formData.batchYear,
        place: formData.place,
        profession: formData.profession,
        status: data.accountStatus || "pending",
      };

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "alumni_pending_user",
          JSON.stringify(pendingUser),
        );
      }

      // Always redirect to waiting page — never directly to dashboard
      router.push("/auth/pending");
    } catch (error) {
      console.error(error);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const roles: { value: UserRole; label: string; icon: string }[] = [
    { value: "alumni", label: "Alumni", icon: "🎓" },
    { value: "student", label: "Student", icon: "📚" },
    { value: "faculty", label: "Faculty", icon: "🏫" },
  ];

  const passwordStrength = () => {
    const p = formData.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-navy-950 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-navy-700/50 rounded-full blur-3xl" />

        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <div className="bg-gold-500 p-1.5 rounded-lg">
            <GraduationCap className="h-5 w-5 text-navy-950" />
          </div>
          <span className="font-serif font-bold text-white text-xl">
            ALUMNI
          </span>
        </Link>

        <div className="relative z-10">
          <h1 className="font-serif text-4xl font-bold text-white leading-tight mb-6">
            Join 35,000+
            <br />
            alumni <span className="gradient-text">worldwide</span>
          </h1>
          <p className="text-gray-300 leading-relaxed mb-10">
            Create your account to access the full suite of alumni resources,
            connections, and opportunities.
          </p>

          {/* Step indicators */}
          <div className="space-y-3">
            {[
              { num: 1, label: "Account Setup", done: step > 1 },
              { num: 2, label: "Academic Details", done: false },
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    s.done
                      ? "bg-green-500 text-white"
                      : step === s.num
                        ? "bg-gold-500 text-navy-950"
                        : "bg-navy-800 text-gray-400"
                  }`}
                >
                  {s.done ? <CheckCircle className="h-4 w-4" /> : s.num}
                </div>
                <span
                  className={`text-sm ${step === s.num ? "text-white font-medium" : "text-gray-400"}`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-10 p-4 bg-navy-800/60 rounded-xl border border-navy-700/50">
            <p className="text-gold-400 text-sm font-semibold mb-1">
              ⏳ Account Approval
            </p>
            <p className="text-gray-400 text-xs leading-relaxed">
              After signing up, your account will be reviewed by an admin.
              You&apos;ll receive an email once approved.
            </p>
          </div>
        </div>

        <p className="text-gray-500 text-xs relative z-10">
          © 2024 Alumni Network. Verified University Platform.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-10 overflow-y-auto">
        <div className="w-full max-w-lg">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="bg-navy-800 p-1.5 rounded-lg">
              <GraduationCap className="h-5 w-5 text-gold-500" />
            </div>
            <span className="font-serif font-bold text-navy-900 text-xl">
              ALUMNI
            </span>
          </div>

          {/* Step progress */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2].map((n) => (
              <div key={n} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    step > n
                      ? "bg-green-500 text-white"
                      : step === n
                        ? "bg-navy-800 text-white"
                        : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {step > n ? "✓" : n}
                </div>
                {n < 2 && (
                  <div
                    className={`h-0.5 w-10 ${step > n ? "bg-green-500" : "bg-gray-200"}`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mb-7">
            <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">
              {step === 1 ? "Create Account" : "Academic Details"}
            </h2>
            <p className="text-gray-500 text-sm">
              {step === 1
                ? "Step 1 of 2 — Basic information"
                : "Step 2 of 2 — Tell us about your studies"}
            </p>
          </div>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-navy-800 mb-2 font-sans">
                  I am a
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => update("role", role.value)}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${
                        formData.role === role.value
                          ? "border-navy-800 bg-navy-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-xl mb-0.5">{role.icon}</div>
                      <div className="text-xs font-semibold text-navy-900">
                        {role.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <AuthInput
                label="Full Name"
                type="text"
                placeholder="Jane Smith"
                icon={User}
                value={formData.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                error={errors.fullName}
              />

              <AuthInput
                label="Email Address"
                type="email"
                placeholder="jane@email.com"
                icon={Mail}
                value={formData.email}
                onChange={(e) => update("email", e.target.value)}
                error={errors.email}
              />

              <div>
                <AuthInput
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 characters"
                  icon={Lock}
                  value={formData.password}
                  onChange={(e) => update("password", e.target.value)}
                  error={errors.password}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
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
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full ${i <= strength ? strengthColors[strength] : "bg-gray-200"}`}
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
                label="Confirm Password"
                type="password"
                placeholder="Repeat password"
                icon={Lock}
                value={formData.confirmPassword}
                onChange={(e) => update("confirmPassword", e.target.value)}
                error={errors.confirmPassword}
              />

              <button
                type="button"
                onClick={handleNext}
                className="w-full btn-primary mt-2"
              >
                Continue →
              </button>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-navy-800 mb-1.5 font-sans">
                  Department *
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => update("department", e.target.value)}
                  className="input-field cursor-pointer"
                >
                  <option value="">Select department</option>
                  {departments.slice(1).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.department}
                  </p>
                )}
              </div>

              {/* Batch Year */}
              <div>
                <label className="block text-sm font-medium text-navy-800 mb-1.5 font-sans">
                  Batch Year *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <select
                    value={formData.batchYear}
                    onChange={(e) => update("batchYear", e.target.value)}
                    className="input-field pl-10 cursor-pointer"
                  >
                    <option value="">Select batch year</option>
                    {batchYears.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.batchYear && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.batchYear}
                  </p>
                )}
              </div>

              {/* Place */}
              <AuthInput
                label="Place / City *"
                type="text"
                placeholder="e.g. Bangalore, India"
                icon={MapPin}
                value={formData.place}
                onChange={(e) => update("place", e.target.value)}
                error={errors.place}
              />

              {/* Profession */}
              <AuthInput
                label="Profession / Current Role"
                type="text"
                placeholder="e.g. Software Engineer at Google"
                icon={Briefcase}
                value={formData.profession}
                onChange={(e) => update("profession", e.target.value)}
              />

              {/* Gmail */}
              <AuthInput
                label="Gmail (Optional)"
                type="email"
                placeholder="johndoe.work@gmail.com"
                icon={Mail}
                value={formData.gmail}
                onChange={(e) => update("gmail", e.target.value)}
              />

              {/* Phone */}
              <AuthInput
                label="Phone Number"
                type="tel"
                placeholder="+1 (234) 567-890"
                icon={Phone}
                value={formData.phone}
                onChange={(e) => update("phone", e.target.value)}
              />

              {/* LinkedIn */}
              <AuthInput
                label="LinkedIn Profile (Optional)"
                type="url"
                placeholder="linkedin.com/in/yourname"
                icon={Linkedin}
                value={formData.linkedin}
                onChange={(e) => update("linkedin", e.target.value)}
              />

              {/* Approval notice */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                <span className="text-2xl">⏳</span>
                <div>
                  <p className="font-semibold text-amber-800 text-sm">
                    Account Approval Required
                  </p>
                  <p className="text-amber-700 text-xs mt-0.5 leading-relaxed">
                    Your account will be reviewed by an administrator. This may
                    take a few days. You will be notified by email once
                    approved.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border-2 border-navy-800 text-navy-800 font-semibold py-3 rounded-lg hover:bg-navy-50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-gold flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Submit for Approval"
                  )}
                </button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-gray-500 font-sans">
            Already a member?{" "}
            <Link
              href="/auth/login"
              className="text-gold-600 hover:text-gold-700 font-semibold"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
