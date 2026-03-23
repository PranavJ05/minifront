"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
Mail,
Lock,
Eye,
EyeOff,
User,
Phone,
Linkedin,
MapPin,
Briefcase,
Calendar,
} from "lucide-react";

import AuthInput from "@/components/auth/AuthInput";
import { UserRole } from "@/types";
import { departments } from "@/lib/mockData";

const batchYears = Array.from({ length: 71 }, (_, i) =>
String(1980 + i)
);

export default function SignupPage() {
const router = useRouter();

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
    gmail: formData.gmail,
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
{ value: "faculty", label: "Faculty", icon: "🏫" },
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
        <div className="grid grid-cols-3 gap-2">
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
              label="Gmail"
              value={formData.gmail}
              onChange={(e) =>
                update("gmail", e.target.value)
              }
              icon={Mail}
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
