"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle, GraduationCap } from "lucide-react";

import AuthInput from "@/components/auth/AuthInput";
import RoleSelector from "@/components/auth/RoleSelector";
import StudentSignupForm from "@/components/auth/StudentSignupForm";
import AlumniSignupForm from "@/components/auth/AlumniSignupForm";
import AcademicDetails from "@/components/auth/AcademicDetails";
import LocationSelector from "@/components/auth/LocationSelector";
import { BACKEND_URL } from "@/lib/config";
import { departments } from "@/lib/mockData";
import { UserRole } from "@/types";

const batchYears = Array.from(
  { length: new Date().getFullYear() - 1979 + 4 },
  (_, index) => String(1980 + index),
);

const branchesList = [
  "CSA",
  "CSB",
  "CSC",
  "CSBS",
  "ECA",
  "ECB",
  "EV",
  "EEE",
  "EB",
  "ME",
];

type SignupResponse = {
  id?: string | number | null;
  email?: string;
  name?: string;
  department?: string;
  batchYear?: string | number;
  accountStatus?: string;
  location?: string;
  message?: string;
};

type LocationCountry = {
  name: string;
  iso2: string;
  latitude?: string | null;
  longitude?: string | null;
};

type LocationState = {
  name: string;
  iso2: string;
  latitude?: string | null;
  longitude?: string | null;
};

type LocationCity = {
  name: string;
  latitude?: string | null;
  longitude?: string | null;
};

// Base form data interface
interface BaseFormData {
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  department: string;
  branch: string;
  batchYear: string;
  countryCode: string;
  country: string;
  stateCode: string;
  state: string;
  city: string;
}

// Student-specific fields
interface StudentFields {
  fullName: string;
  rollNumber: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  profileUrl: string;
  currentSemester: string;
  cgpa: string;
  bio: string;
}

// Alumni-specific fields
interface AlumniFields {
  fullName: string;
  linkedinUrl: string;
  currentRole: string;
  company: string;
  phone: string;
}

// Combined form data type
type FormData = BaseFormData & StudentFields & AlumniFields;

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [countries, setCountries] = useState<LocationCountry[]>([]);
  const [states, setStates] = useState<LocationState[]>([]);
  const [cities, setCities] = useState<LocationCity[]>([]);
  const [locationLoading, setLocationLoading] = useState({
    countries: false,
    states: false,
    cities: false,
  });

  const [formData, setFormData] = useState<FormData>({
    // Base fields
    email: "",
    password: "",
    confirmPassword: "",
    role: "alumni",
    department: "",
    branch: "",
    batchYear: "",
    countryCode: "",
    country: "",
    stateCode: "",
    state: "",
    city: "",
    // Student fields
    fullName: "",
    rollNumber: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    profileUrl: "",
    currentSemester: "",
    cgpa: "",
    bio: "",
    // Alumni fields
    currentRole: "",
    company: "",
    phone: "",
  });

  const update = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  // Load countries on mount
  useEffect(() => {
    const loadCountries = async () => {
      setLocationLoading((prev) => ({ ...prev, countries: true }));
      try {
        const res = await fetch("/api/location/countries");
        if (!res.ok) throw new Error("Failed to load countries");
        const data: LocationCountry[] = await res.json();
        setCountries(data);
      } catch (error) {
        console.error(error);
        setErrors((prev) => ({
          ...prev,
          location: "Country, state, and city could not be loaded.",
        }));
      } finally {
        setLocationLoading((prev) => ({ ...prev, countries: false }));
      }
    };
    loadCountries();
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (!formData.countryCode) {
      setStates([]);
      return;
    }
    const loadStates = async () => {
      setLocationLoading((prev) => ({ ...prev, states: true }));
      try {
        const res = await fetch(
          `/api/location/states?countryCode=${formData.countryCode}`,
        );
        if (!res.ok) throw new Error("Failed to load states");
        const data: LocationState[] = await res.json();
        setStates(data);
      } catch (error) {
        console.error(error);
        setErrors((prev) => ({
          ...prev,
          state: "States could not be loaded for that country.",
        }));
      } finally {
        setLocationLoading((prev) => ({ ...prev, states: false }));
      }
    };
    loadStates();
  }, [formData.countryCode]);

  // Load cities when state changes
  useEffect(() => {
    if (!formData.countryCode || !formData.stateCode) {
      setCities([]);
      return;
    }
    const loadCities = async () => {
      setLocationLoading((prev) => ({ ...prev, cities: true }));
      try {
        const res = await fetch(
          `/api/location/cities?countryCode=${formData.countryCode}&stateCode=${formData.stateCode}`,
        );
        if (!res.ok) throw new Error("Failed to load cities");
        const data: LocationCity[] = await res.json();
        setCities(data);
      } catch (error) {
        console.error(error);
        setErrors((prev) => ({
          ...prev,
          city: "Cities could not be loaded for that state.",
        }));
      } finally {
        setLocationLoading((prev) => ({ ...prev, cities: false }));
      }
    };
    loadCities();
  }, [formData.countryCode, formData.stateCode]);

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find((item) => item.iso2 === countryCode);
    setFormData((prev) => ({
      ...prev,
      countryCode,
      country: country?.name || "",
      stateCode: "",
      state: "",
      city: "",
    }));
    setStates([]);
    setCities([]);
    setErrors((prev) => ({
      ...prev,
      country: "",
      state: "",
      city: "",
      location: "",
    }));
  };

  const handleStateChange = (stateCode: string) => {
    const state = states.find((item) => item.iso2 === stateCode);
    setFormData((prev) => ({
      ...prev,
      stateCode,
      state: state?.name || "",
      city: "",
    }));
    setCities([]);
    setErrors((prev) => ({
      ...prev,
      state: "",
      city: "",
    }));
  };

  const handleCityChange = (city: string) => {
    setFormData((prev) => ({ ...prev, city }));
    if (errors.city) {
      setErrors((prev) => ({ ...prev, city: "" }));
    }
  };

  const validateStep1 = () => {
    const nextErrors: Record<string, string> = {};

    if (formData.role === "student") {
      if (!formData.rollNumber.trim()) {
        nextErrors.rollNumber = "Roll number is required";
      }
    } else if (!formData.fullName.trim()) {
      nextErrors.fullName = "Full name is required";
    }

    if (!formData.email.includes("@")) {
      nextErrors.email = "Valid email required";
    }

    if (formData.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateStep2 = () => {
    const nextErrors: Record<string, string> = {};

    if (!formData.department) {
      nextErrors.department = "Department is required";
    }

    if (!formData.branch) {
      nextErrors.branch = "Branch is required";
    }

    if (!formData.batchYear) {
      nextErrors.batchYear = "Batch year is required";
    }

    if (!formData.countryCode || !formData.country) {
      nextErrors.country = "Country is required";
    }

    if (!formData.stateCode || !formData.state) {
      nextErrors.state = "State is required";
    }

    if (!formData.city) {
      nextErrors.city = "City is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);

    try {
      const selectedCountry = countries.find(
        (country) => country.iso2 === formData.countryCode,
      );
      const selectedState = states.find(
        (state) => state.iso2 === formData.stateCode,
      );
      const selectedCity = cities.find((city) => city.name === formData.city);
      const location = [formData.city, formData.state, formData.country]
        .filter(Boolean)
        .join(", ");

      const payload = {
        name:
          formData.role === "student"
            ? formData.rollNumber.trim()
            : formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role.toUpperCase(),
        batchYear: Number(formData.batchYear),
        batch: formData.batch,
        department: formData.department,
        branch: formData.branch,
        // Student specific
        rollNumber:
          formData.role === "student" ? formData.rollNumber : undefined,
        fullName: formData.role !== "student" ? formData.fullName : undefined,
        currentSemester:
          formData.role === "student" ? formData.currentSemester : undefined,
        cgpa: formData.role === "student" ? formData.cgpa : undefined,
        bio: formData.role === "student" ? formData.bio : undefined,
        githubUrl: formData.role === "student" ? formData.githubUrl : undefined,
        portfolioUrl:
          formData.role === "student" ? formData.portfolioUrl : undefined,
        profileUrl:
          formData.role === "student"
            ? formData.profileUrl
            : formData.profileUrl || undefined,
        // Alumni specific
        phone: formData.phone.trim() || undefined,
        currentRole:
          formData.role === "alumni" ? formData.currentRole : undefined,
        company: formData.role === "alumni" ? formData.company : undefined,
        // Common
        linkedinUrl: formData.linkedinUrl.trim() || undefined,
        location,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        countryCode: formData.countryCode,
        stateCode: formData.stateCode,
        latitude:
          selectedCity?.latitude ||
          selectedState?.latitude ||
          selectedCountry?.latitude ||
          undefined,
        longitude:
          selectedCity?.longitude ||
          selectedState?.longitude ||
          selectedCountry?.longitude ||
          undefined,
      };

      const res = await fetch(`${BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: SignupResponse = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "pendingUserData",
          JSON.stringify({
            user: {
              id: data.id ?? "",
              name: data.name || payload.name,
              email: data.email || payload.email,
              department: data.department || payload.department,
              batchYear: data.batchYear ?? payload.batchYear,
              status: data.accountStatus || "PENDING",
              location: data.location || payload.location,
              profession: payload.currentRole || null,
              company: payload.company || null,
              country: payload.country,
              state: payload.state,
              city: payload.city,
              latitude: payload.latitude || null,
              longitude: payload.longitude || null,
            },
            status: "PENDING",
            timestamp: Date.now(),
          }),
        );
      }

      router.push("/auth/pending");
    } catch (err: any) {
      setErrors({
        submit: err?.message || "Signup failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedCountry = countries.find(
    (country) => country.iso2 === formData.countryCode,
  );
  const selectedState = states.find(
    (state) => state.iso2 === formData.stateCode,
  );
  const selectedCity = cities.find((city) => city.name === formData.city);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel - Desktop */}
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

          <div className="space-y-3">
            {[
              { num: 1, label: "Account Setup", done: step > 1 },
              { num: 2, label: "Academic Details", done: false },
            ].map((item) => (
              <div key={item.num} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    item.done
                      ? "bg-green-500 text-white"
                      : step === item.num
                        ? "bg-gold-500 text-navy-950"
                        : "bg-navy-800 text-gray-400"
                  }`}
                >
                  {item.done ? <CheckCircle className="h-4 w-4" /> : item.num}
                </div>
                <span
                  className={`text-sm ${
                    step === item.num
                      ? "text-white font-medium"
                      : "text-gray-400"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-gray-500 text-xs relative z-10">
          © 2024 Alumni Network. Verified University Platform.
        </p>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="bg-navy-800 p-1.5 rounded-lg">
              <GraduationCap className="h-5 w-5 text-gold-500" />
            </div>
            <span className="font-serif font-bold text-navy-900 text-xl">
              ALUMNI
            </span>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === 1
                    ? "bg-navy-800 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {step === 1 ? "1" : "✓"}
              </div>
              <div className="h-0.5 w-8 bg-gray-200" />
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === 2
                    ? "bg-navy-800 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
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
                : "Step 2 of 2 — Tell us about your studies and location"}
            </p>
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <RoleSelector
                selectedRole={formData.role}
                onSelectRole={(role) => update("role", role)}
              />

              {formData.role === "student" ? (
                <StudentSignupForm
                  formData={{
                    fullName: formData.fullName,
                    rollNumber: formData.rollNumber,
                    email: formData.email,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword,
                    linkedinUrl: formData.linkedinUrl,
                    githubUrl: formData.githubUrl,
                    portfolioUrl: formData.portfolioUrl,
                    profileUrl: formData.profileUrl,
                    currentSemester: formData.currentSemester,
                    cgpa: formData.cgpa,
                    bio: formData.bio,
                  }}
                  onChange={update}
                  errors={errors}
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                />
              ) : (
                <AlumniSignupForm
                  formData={{
                    fullName: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword,
                    linkedinUrl: formData.linkedinUrl,
                    currentRole: formData.currentRole,
                    company: formData.company,
                    phone: formData.phone,
                  }}
                  onChange={update}
                  errors={errors}
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                />
              )}

              <button
                type="button"
                onClick={handleNext}
                className="w-full btn-primary"
              >
                Continue →
              </button>
            </div>
          )}

          {/* Step 2: Academic & Location */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.submit && (
                <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm">
                  {errors.submit}
                </div>
              )}

              <AcademicDetails
                role={formData.role}
                departments={departments}
                branches={branchesList}
                batchYears={batchYears}
                selectedDepartment={formData.department}
                selectedBranch={formData.branch}
                selectedBatchYear={formData.batchYear}
                errors={errors}
                onDepartmentChange={(v) => update("department", v)}
                onBranchChange={(v) => update("branch", v)}
                onBatchYearChange={(v) => update("batchYear", v)}
              />

              <LocationSelector
                countries={countries}
                states={states}
                cities={cities}
                selectedCountryCode={formData.countryCode}
                selectedStateCode={formData.stateCode}
                selectedCity={formData.city}
                loading={locationLoading}
                errors={errors}
                onCountryChange={handleCountryChange}
                onStateChange={handleStateChange}
                onCityChange={handleCityChange}
              />

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-2.5 px-4 border-2 border-navy-800 text-navy-800 font-semibold rounded-lg hover:bg-navy-50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </div>
            </form>
          )}

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-navy-800 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
