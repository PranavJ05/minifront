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
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import AuthInput from "@/components/auth/AuthInput";
import { UserRole } from "@/types";
import { departments, graduationYears } from "@/lib/mockData";
import { getDashboardPath } from "@/lib/utils";

export default function SignupPage() {
const router = useRouter();

<<<<<<< Updated upstream
const [step, setStep] = useState(1);
const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);
const [errors, setErrors] = useState<Record<string, string>>({});

const [formData, setFormData] = useState({
fullName: "",
rollNumber: "",
email: "",
password: "",
confirmPassword: "",
role: "alumni" as UserRole,
department: "",
batchYear: "",
phone: "",
linkedin: "",
place: "",
profession: "",
gmail: "",
});

const update = (key: string, value: string) => {
setFormData((prev) => ({ ...prev, [key]: value }));
if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
};

// ================= VALIDATIONS =================

const validateStep1 = () => {
const e: Record<string, string> = {};


if (formData.role === "student" && !formData.rollNumber.trim()) {
  e.rollNumber = "Roll Number is required";
}

if (formData.role !== "student" && !formData.fullName.trim()) {
  e.fullName = "Full name is required";
}

if (!formData.email.includes("@")) {
  e.email = "Valid email required";
}

if (formData.password.length < 6) {
  e.password = "Password must be at least 6 characters";
}

if (formData.password !== formData.confirmPassword) {
  e.confirmPassword = "Passwords do not match";
}

setErrors(e);
return Object.keys(e).length === 0;


};

const validateStep2 = () => {
const e: Record<string, string> = {};


if (!formData.department) {
  e.department = "Department is required";
}

if (!formData.batchYear) {
  e.batchYear = "Batch year is required";
}

if (formData.role !== "student" && !formData.place.trim()) {
  e.place = "Place is required";
}

setErrors(e);
return Object.keys(e).length === 0;


};

const handleNext = () => {
if (validateStep1()) setStep(2);
};

// ================= MAIN SUBMIT =================

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();


if (!validateStep2()) return;

setLoading(true);

try {
  const payload = {
    name:
      formData.role === "student"
        ? formData.rollNumber // student uses roll number
        : formData.fullName,

    email: formData.email,
    password: formData.password,

    role: formData.role.toUpperCase(), // 🔥 IMPORTANT

    batchYear: parseInt(formData.batchYear),
    department: formData.department,

    // Alumni fields
    placeOfResidence: formData.place,
    profession: formData.profession,
    linkedinUrl: formData.linkedin,
  };
  console.log("Submitting payload:", payload);
  const res = await fetch("http://localhost:8080/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Registration failed");
  }

  const data = await res.json();

  const pendingUser = {
    email: data.email,
    name: data.name,
    role: formData.role,
    status: data.accountStatus || "pending",
  };

  localStorage.setItem(
    "alumni_pending_user",
    JSON.stringify(pendingUser)
=======
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
  });

  const update = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.includes("@")) newErrors.email = "Valid email required";
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.graduationYear)
      newErrors.graduationYear = "Graduation year is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setLoading(true);

    try {
      // Only send required fields to backend
      const signupData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        department: formData.department,
        graduationYear: Number(formData.graduationYear),
      };

      // Dynamically import authService to avoid SSR issues
      const { default: authService } =
        await import("@/lib/services/authService");
      const pendingUser = await authService.signUp(signupData);

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "pendingUserData",
          JSON.stringify({
            user: pendingUser,
            status: "PENDING",
            timestamp: Date.now(),
          }),
        );
      }
      router.push("/pending");
    } catch (err: any) {
      console.error("Signup error:", err);
      setErrors({ submit: err.message || "Signup failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const roles: { value: UserRole; label: string; icon: string }[] = [
    { value: "alumni", label: "Alumni", icon: "🎓" },
    { value: "student", label: "Student", icon: "📚" },
    { value: "faculty", label: "Faculty", icon: "👩‍🏫" },
  ];

  const passwordStrength = () => {
    const p = formData.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy-950 relative overflow-hidden flex-col justify-between p-12">
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
          <p className="text-gray-300 text-lg leading-relaxed mb-10">
            Create your account to access the full suite of alumni resources,
            connections, and opportunities.
          </p>

          {/* Steps indicator */}
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
        </div>

        <p className="text-gray-500 text-xs relative z-10">
          © 2024 Alumni Network. Verified University Platform.
        </p>
      </div>

      {/* Right panel - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="bg-navy-800 p-1.5 rounded-lg">
              <GraduationCap className="h-5 w-5 text-gold-500" />
            </div>
            <span className="font-serif font-bold text-navy-900 text-xl">
              ALUMNI
            </span>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 1 ? "bg-navy-800 text-white" : "bg-green-500 text-white"}`}
              >
                {step === 1 ? "1" : "✓"}
              </div>
              <div className="h-0.5 w-8 bg-gray-200" />
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? "bg-navy-800 text-white" : "bg-gray-200 text-gray-400"}`}
              >
                2
              </div>
            </div>
            <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">
              {step === 1 ? "Create Account" : "Academic Details"}
            </h2>
            <p className="text-gray-500 text-sm">
              {step === 1
                ? "Step 1 of 2 — Basic information"
                : "Step 2 of 2 — Tell us about your studies"}
            </p>
          </div>

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
                className="w-full btn-primary"
              >
                Continue →
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.submit && (
                <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-2">
                  {errors.submit}
                </div>
              )}
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
                  {departments.slice(1).map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.department}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-800 mb-1.5 font-sans">
                  {formData.role === "student"
                    ? "Expected Graduation Year *"
                    : "Graduation Year *"}
                </label>
                <select
                  value={formData.graduationYear}
                  onChange={(e) => update("graduationYear", e.target.value)}
                  className="input-field cursor-pointer"
                >
                  <option value="">Select year</option>
                  {graduationYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.graduationYear && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.graduationYear}
                  </p>
                )}
              </div>

              <AuthInput
                label="Phone Number"
                type="tel"
                placeholder="+1 (234) 567-890"
                icon={Phone}
                value={formData.phone}
                onChange={(e) => update("phone", e.target.value)}
              />

              <AuthInput
                label="LinkedIn Profile (Optional)"
                type="url"
                placeholder="linkedin.com/in/yourname"
                icon={Linkedin}
                value={formData.linkedin}
                onChange={(e) => update("linkedin", e.target.value)}
              />

              <div className="flex gap-3">
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
                  className="flex-2 btn-gold flex-1 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Create Account"
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
>>>>>>> Stashed changes
  );

  router.push("/auth/pending");
} catch (error) {
  console.error(error);
  alert("Registration failed. Please try again.");
} finally {
  setLoading(false);
}


};

// ================= UI =================

const roles: { value: UserRole; label: string; icon: string }[] = [
{ value: "alumni", label: "Alumni", icon: "🎓" },
{ value: "student", label: "Student", icon: "📚" },
];

return ( <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4"> <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-md">

```
    <h2 className="text-2xl font-bold mb-4">
      {step === 1 ? "Create Account" : "Academic Details"}
    </h2>

    {/* ================= STEP 1 ================= */}
    {step === 1 && (
      <div className="space-y-4">

        {/* ROLE */}
        <div className="grid grid-cols-2 gap-2">
          {roles.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => update("role", r.value)}
              className={`p-3 border rounded ${
                formData.role === r.value
                  ? "border-blue-600 bg-blue-50"
                  : ""
              }`}
            >
              {r.icon} {r.label}
            </button>
          ))}
        </div>

        {/* NAME / ROLL */}
        {formData.role === "student" ? (
          <AuthInput
            label="Roll Number"
            value={formData.rollNumber}
            onChange={(e) =>
              update("rollNumber", e.target.value)
            }
            error={errors.rollNumber}
            icon={User}
          />
        ) : (
          <AuthInput
            label="Full Name"
            value={formData.fullName}
            onChange={(e) =>
              update("fullName", e.target.value)
            }
            error={errors.fullName}
            icon={User}
          />
        )}

        {/* EMAIL */}
        <AuthInput
          label="Email"
          value={formData.email}
          onChange={(e) => update("email", e.target.value)}
          error={errors.email}
          icon={Mail}
        />

        {/* PASSWORD */}
        <AuthInput
          label="Password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={(e) =>
            update("password", e.target.value)
          }
          error={errors.password}
          icon={Lock}
          rightElement={
            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          }
        />

        {/* CONFIRM */}
        <AuthInput
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) =>
            update("confirmPassword", e.target.value)
          }
          error={errors.confirmPassword}
          icon={Lock}
        />

        <button
          onClick={handleNext}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Continue →
        </button>
      </div>
    )}

    {/* ================= STEP 2 ================= */}
    {step === 2 && (
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* DEPT */}
        <select
          value={formData.department}
          onChange={(e) =>
            update("department", e.target.value)
          }
          className="w-full border p-2 rounded"
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        {/* BATCH */}
        <select
          value={formData.batchYear}
          onChange={(e) =>
            update("batchYear", e.target.value)
          }
          className="w-full border p-2 rounded"
        >
          <option value="">Select Batch Year</option>
          {batchYears.map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>

        {/* ALUMNI EXTRA */}
        {formData.role !== "student" && (
          <>
            <AuthInput
              label="Place"
              value={formData.place}
              onChange={(e) =>
                update("place", e.target.value)
              }
              error={errors.place}
              icon={MapPin}
            />

            <AuthInput
              label="Profession"
              value={formData.profession}
              onChange={(e) =>
                update("profession", e.target.value)
              }
              icon={Briefcase}
            />


            <AuthInput
              label="LinkedIn"
              value={formData.linkedin}
              onChange={(e) =>
                update("linkedin", e.target.value)
              }
              icon={Linkedin}
            />
          </>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex-1 border py-2 rounded"
          >
            Back
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-2 rounded"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    )}
  </div>
</div>


);
}
