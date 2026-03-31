"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Building2,
  CheckCircle,
  Eye,
  EyeOff,
  GraduationCap,
  Linkedin,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

import AuthInput from "@/components/auth/AuthInput";
import { BACKEND_URL } from "@/lib/config";
import { departments } from "@/lib/mockData";
import { UserRole } from "@/types";

const batchYears = Array.from(
  { length: new Date().getFullYear() - 1979 + 4 },
  (_, index) => String(1980 + index),
);

// The 10 specific branches from your database
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

  const [formData, setFormData] = useState({
    fullName: "",
    rollNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "alumni" as UserRole,
    department: "",
    branch: "", // NEW: Branch field added here
    batchYear: "",
    batch: "",
    phone: "",
    linkedin: "",
    currentRole: "",
    company: "",
    countryCode: "",
    country: "",
    stateCode: "",
    state: "",
    city: "",
  });

  const update = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  useEffect(() => {
    const loadCountries = async () => {
      setLocationLoading((prev) => ({ ...prev, countries: true }));

      try {
        const res = await fetch("/api/location/countries");
        if (!res.ok) {
          throw new Error("Failed to load countries");
        }

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
        if (!res.ok) {
          throw new Error("Failed to load states");
        }

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
        if (!res.ok) {
          throw new Error("Failed to load cities");
        }

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
    setFormData((prev) => ({
      ...prev,
      city,
    }));
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
        branch: formData.branch, // Sending the selected branch to the backend
        phone: formData.phone.trim() || undefined,
        profession: formData.currentRole.trim() || undefined,
        company: formData.company.trim() || undefined,
        linkedinUrl: formData.linkedin.trim() || undefined,
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
        headers: {
          "Content-Type": "application/json",
        },
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
              profession: payload.profession || null,
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

  const roles: { value: UserRole; label: string; icon: string }[] = [
    { value: "alumni", label: "Alumni", icon: "🎓" },
    { value: "student", label: "Student", icon: "📚" },
    { value: "faculty", label: "Faculty", icon: "👩‍🏫" },
  ];

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
  const selectedCountry = countries.find(
    (country) => country.iso2 === formData.countryCode,
  );
  const selectedState = states.find(
    (state) => state.iso2 === formData.stateCode,
  );
  const selectedCity = cities.find((city) => city.name === formData.city);
  const locationPreview = [formData.city, formData.state, formData.country]
    .filter(Boolean)
    .join(", ");

  const payloadPreview = {
    name:
      formData.role === "student"
        ? formData.rollNumber || "STUDENT_ROLL_NO"
        : formData.fullName || "Jane Smith",
    email: formData.email || "jane@email.com",
    password: "********",
    role: formData.role.toUpperCase(),
    batchYear: formData.batchYear ? Number(formData.batchYear) : 2024,
    department: formData.department || "CSE",
    branch: formData.branch || "CSA", // Shows up in the preview window
    phone: formData.phone || "+91 9876543210",
    profession: formData.currentRole || "Software Engineer",
    company: formData.company || "Google",
    linkedinUrl: formData.linkedin || "https://linkedin.com/in/yourname",
    location: locationPreview || "Kochi, Kerala, India",
    country: formData.country || "India",
    state: formData.state || "Kerala",
    city: formData.city || "Kochi",
    countryCode: formData.countryCode || "IN",
    stateCode: formData.stateCode || "KL",
    latitude:
      selectedCity?.latitude ||
      selectedState?.latitude ||
      selectedCountry?.latitude ||
      "9.9312",
    longitude:
      selectedCity?.longitude ||
      selectedState?.longitude ||
      selectedCountry?.longitude ||
      "76.2673",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
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
                  className={`text-sm ${step === item.num ? "text-white font-medium" : "text-gray-400"}`}
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
                : "Step 2 of 2 — Tell us about your studies and location"}
            </p>
          </div>

          {step === 1 && (
            <div className="space-y-4">
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

              {formData.role === "student" ? (
                <AuthInput
                  label="Roll Number"
                  type="text"
                  placeholder="Enter your roll number"
                  icon={User}
                  value={formData.rollNumber}
                  onChange={(e) => update("rollNumber", e.target.value)}
                  error={errors.rollNumber}
                />
              ) : (
                <AuthInput
                  label="Full Name"
                  type="text"
                  placeholder="Jane Smith"
                  icon={User}
                  value={formData.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  error={errors.fullName}
                />
              )}

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
                      {[1, 2, 3, 4].map((index) => (
                        <div
                          key={index}
                          className={`h-1.5 flex-1 rounded-full ${index <= strength ? strengthColors[strength] : "bg-gray-200"}`}
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

              {errors.location && (
                <div className="bg-amber-50 text-amber-700 px-3 py-2 rounded">
                  {errors.location}
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
                  {departments.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.department}
                  </p>
                )}
              </div>

              {/* NEW: Branch Dropdown */}
              <div>
                <label className="block text-sm font-medium text-navy-800 mb-1.5 font-sans">
                  Branch *
                </label>
                <select
                  value={formData.branch}
                  onChange={(e) => update("branch", e.target.value)}
                  className="input-field cursor-pointer"
                >
                  <option value="">Select branch</option>
                  {branchesList.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
                {errors.branch && (
                  <p className="mt-1 text-sm text-red-600">{errors.branch}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-800 mb-1.5 font-sans">
                  {formData.role === "student"
                    ? "Expected Graduation Year *"
                    : "Batch Year *"}
                </label>
                <select
                  value={formData.batchYear}
                  onChange={(e) => update("batchYear", e.target.value)}
                  className="input-field cursor-pointer"
                >
                  <option value="">Select year</option>
                  {batchYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.batchYear && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.batchYear}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-800 mb-1.5 font-sans">
                  Country *
                </label>
                <select
                  value={formData.countryCode}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="input-field cursor-pointer"
                  disabled={locationLoading.countries}
                >
                  <option value="">
                    {locationLoading.countries
                      ? "Loading countries..."
                      : "Select country"}
                  </option>
                  {countries.map((country) => (
                    <option key={country.iso2} value={country.iso2}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-800 mb-1.5 font-sans">
                  State *
                </label>
                <select
                  value={formData.stateCode}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="input-field cursor-pointer"
                  disabled={!formData.countryCode || locationLoading.states}
                >
                  <option value="">
                    {locationLoading.states
                      ? "Loading states..."
                      : "Select state"}
                  </option>
                  {states.map((state) => (
                    <option key={state.iso2} value={state.iso2}>
                      {state.name}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-800 mb-1.5 font-sans">
                  City *
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="input-field cursor-pointer"
                  disabled={!formData.stateCode || locationLoading.cities}
                >
                  <option value="">
                    {locationLoading.cities
                      ? "Loading cities..."
                      : "Select city"}
                  </option>
                  {cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
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
                label="Current Role"
                type="text"
                placeholder="Senior Product Designer"
                icon={Briefcase}
                value={formData.currentRole}
                onChange={(e) => update("currentRole", e.target.value)}
              />

              <AuthInput
                label="Company"
                type="text"
                placeholder="Figma"
                icon={Building2}
                value={formData.company}
                onChange={(e) => update("company", e.target.value)}
              />

              <AuthInput
                label="LinkedIn Profile (Optional)"
                type="url"
                placeholder="linkedin.com/in/yourname"
                icon={Linkedin}
                value={formData.linkedin}
                onChange={(e) => update("linkedin", e.target.value)}
              />

              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <p className="font-semibold">Privacy notice</p>
                <p className="mt-1">
                  Your current role, company, and location details are used to
                  support alumni discovery and future map views. They are not
                  intended to be shared outside the alumni platform for
                  unrelated third-party use.
                </p>
              </div>

              <div className="rounded-xl bg-navy-50 border border-navy-100 px-3 py-2 text-sm text-navy-700">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">Map location</span>
                </div>
                <p className="mt-1 text-navy-600">
                  {formData.city && formData.state && formData.country
                    ? `${formData.city}, ${formData.state}, ${formData.country}`
                    : "Choose country, state, and city to place this user on the alumni map."}
                </p>
                <p className="mt-1 text-xs text-navy-500">
                  Latitude:{" "}
                  {selectedCity?.latitude ||
                    selectedState?.latitude ||
                    selectedCountry?.latitude ||
                    "pending"}
                  {" · "}
                  Longitude:{" "}
                  {selectedCity?.longitude ||
                    selectedState?.longitude ||
                    selectedCountry?.longitude ||
                    "pending"}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-3">
                <p className="text-xs font-medium text-gray-500 mb-2">
                  Example payload sent to backend
                </p>
                <pre className="overflow-x-auto rounded-lg bg-gray-950 p-3 text-xs text-gray-100">
                  {JSON.stringify(payloadPreview, null, 2)}
                </pre>
              </div>

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
  );
}
