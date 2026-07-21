"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  GraduationCap,
  Loader2,
  AlertCircle,
  Briefcase,
  Building2,
  Globe,
  MapPin,
} from "lucide-react";
import { FaLinkedin } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import RoleSelector from "@/components/auth/RoleSelector";
import StudentSignupForm from "@/components/auth/StudentSignupForm";
import AlumniSignupForm from "@/components/auth/AlumniSignupForm";
import FacultySignupForm from "@/components/auth/FacultySignupForm";
import AcademicDetails from "@/components/auth/AcademicDetails";
import LocationSelector from "@/components/auth/LocationSelector";
import { useCountriesQuery, useStatesQuery, useCitiesQuery } from "@/hooks/queries/location";
import type { LocationCountry, LocationState, LocationCity } from "@/hooks/queries/location";
import { BACKEND_URL } from "@/lib/config";
import { departments } from "@/lib/mockData";
import { UserRole } from "@/types";

const currentYear = new Date().getFullYear();

const alumniBatchYears = Array.from(
  { length: currentYear - 1990 + 1 },
  (_, i) => String(1990 + i),
);

const studentBatchYears = Array.from(
  { length: 4 },
  (_, i) => String(currentYear + 1 + i),
);

const courseBranchMap: Record<string, { branches: string[]; auto: boolean }> = {
  "CSE": { branches: ["CSA", "CSB", "CSC"], auto: false },
  "Electrical Engineering": { branches: ["EEE"], auto: true },
  "Electronics Engineering": { branches: ["ECA", "ECB"], auto: false },
  "Computer Science and Business Systems": { branches: ["CSBS"], auto: true },
  "Mechanical Engineering": { branches: ["ME"], auto: true },
  "VLSI Engineering": { branches: ["EV"], auto: true },
  "Biomedical Engineering": { branches: ["EB"], auto: true },
};

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

interface AlumniFields {
  fullName: string;
  currentRole: string;
  company: string;
  phone: string;
}

interface FacultyFields {
  fullName: string;
  designation: string;
  officeLocation: string;
  phone: string;
}

type FormData = BaseFormData & StudentFields & AlumniFields & FacultyFields;

const inputIconClass =
  "absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60 pointer-events-none";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<FormData>({
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
    fullName: "",
    rollNumber: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    profileUrl: "",
    currentSemester: "",
    cgpa: "",
    bio: "",
    currentRole: "",
    company: "",
    phone: "",
    designation: "",
    officeLocation: "",
  });

  const { data: countries, isLoading: countriesLoading } = useCountriesQuery();
  const { data: states, isLoading: statesLoading } = useStatesQuery(
    formData.countryCode,
  );
  const { data: cities, isLoading: citiesLoading } = useCitiesQuery(
    formData.countryCode,
    formData.stateCode,
  );
  const locationLoading = {
    countries: countriesLoading,
    states: statesLoading,
    cities: citiesLoading,
  };

  const safeCountries = countries ?? [];
  const safeStates = states ?? [];
  const safeCities = cities ?? [];

  const courseInfo = useMemo(
    () => (formData.department ? courseBranchMap[formData.department] : null),
    [formData.department],
  );
  const filteredBranches = courseInfo?.branches ?? [];
  const branchAutoSelected = courseInfo?.auto ?? false;

  const update = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const handleCourseChange = (course: string) => {
    const info = courseBranchMap[course];
    if (info?.auto && info.branches.length === 1) {
      setFormData((prev) => ({
        ...prev,
        department: course,
        branch: info.branches[0],
      }));
    } else {
      update("department", course);
      update("branch", "");
    }
  };

  const handleCountryChange = (countryCode: string) => {
    const country = safeCountries.find((item) => item.iso2 === countryCode);
    setFormData((prev) => ({
      ...prev,
      countryCode,
      country: country?.name || "",
      stateCode: "",
      state: "",
      city: "",
    }));
    setErrors((prev) => ({
      ...prev,
      country: "",
      state: "",
      city: "",
      location: "",
    }));
  };

  const handleStateChange = (stateCode: string) => {
    const state = safeStates.find((item) => item.iso2 === stateCode);
    setFormData((prev) => ({
      ...prev,
      stateCode,
      state: state?.name || "",
      city: "",
    }));
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
      } else if (!/^MDL\d{2}CS\d{3}$/i.test(formData.rollNumber.trim())) {
        nextErrors.rollNumber = "Format: MDL23CS032";
      }
    }
    if (!formData.fullName.trim()) {
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
      nextErrors.department = "Course is required";
    }

    if (
      (formData.role === "student" || formData.role === "alumni") &&
      !formData.branch
    ) {
      nextErrors.branch = "Branch is required";
    }

    if (!formData.batchYear) {
      nextErrors.batchYear = "Year of graduation is required";
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

    if (formData.role === "faculty" && !formData.designation.trim()) {
      nextErrors.designation = "Designation is required";
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
      const selectedCountry = safeCountries.find(
        (country) => country.iso2 === formData.countryCode,
      );
      const selectedState = safeStates.find(
        (state) => state.iso2 === formData.stateCode,
      );
      const selectedCity = safeCities.find((city) => city.name === formData.city);
      const location = [formData.city, formData.state, formData.country]
        .filter(Boolean)
        .join(", ");

      const payload = {
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role.toUpperCase(),
        batchYear: Number(formData.batchYear),
        department: formData.department,
        branch: formData.branch,
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
        phone: formData.phone.trim() || undefined,
        currentRole:
          formData.role === "alumni" ? formData.currentRole : undefined,
        company: formData.role === "alumni" ? formData.company : undefined,
        designation:
          formData.role === "faculty" ? formData.designation : undefined,
        officeLocation:
          formData.role === "faculty" ? formData.officeLocation : undefined,
        linkedinUrl:
          formData.role === "student"
            ? formData.linkedinUrl.trim() || undefined
            : undefined,
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

      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: SignupResponse = await res.json().catch(() => ({}));
      console.log("[Signup] raw response from backend:", JSON.stringify(data));

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      if (formData.role !== "student" && typeof window !== "undefined") {
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

      if (formData.role === "student") {
        router.push(
          `/auth/verify-otp?email=${encodeURIComponent(formData.email)}`,
        );
      } else {
        router.push("/auth/pending");
      }
    } catch (err: unknown) {
      setErrors({
        submit:
          err instanceof Error
            ? err.message
            : "Signup failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedCountry = safeCountries.find(
    (country) => country.iso2 === formData.countryCode,
  );
  const selectedState = safeStates.find(
    (state) => state.iso2 === formData.stateCode,
  );
  const selectedCity = safeCities.find((city) => city.name === formData.city);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel — Desktop (fixed) */}
      <div className="hidden lg:flex lg:w-1/2 bg-card border-r border-border flex-col justify-between p-12 sticky top-0 self-start h-screen">
        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <div className="bg-primary p-1.5 rounded-lg">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-foreground leading-tight">
            Alumni Relations Cell
          </span>
        </Link>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-foreground leading-tight mb-6">
            Join 35,000+
            <br />
            alumni worldwide
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-10">
            Create your account to access the full suite of alumni resources,
            connections, and opportunities.
          </p>

          <div className="space-y-3">
            {[
              { num: 1, label: "Account Setup", done: step > 1 },
              { num: 2, label: "Profile Details", done: false },
            ].map((item) => (
              <div key={item.num} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    item.done
                      ? "bg-emerald-500 text-white"
                      : step === item.num
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {item.done ? <CheckCircle className="h-4 w-4" /> : item.num}
                </div>
                <span
                  className={`text-sm ${
                    step === item.num
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted-foreground relative z-10 leading-relaxed">
          Please reach out to{" "}
          <a href="mailto:arc@mec.ac.in" className="text-foreground font-medium hover:text-foreground/80 underline underline-offset-2 transition-colors">
            arc@mec.ac.in
          </a>{" "}
          if you have any queries or need further assistance.
        </p>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="bg-primary p-1.5 rounded-lg">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground text-lg">ARC</span>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8 space-y-3">
            <div className="space-y-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Step {step} of 2
              </span>
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                    step >= 1 ? "bg-primary" : "bg-muted"
                  }`}
                />
                <div
                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                    step >= 2 ? "bg-primary" : "bg-muted"
                  }`}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>Account Setup</span>
                <span>Profile Details</span>
              </div>
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Create Account
            </h2>
          </div>

          {/* Step 1: Identity + Security */}
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
                  }}
                  onChange={update}
                  errors={errors}
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                />
              ) : formData.role === "faculty" ? (
                <FacultySignupForm
                  formData={{
                    fullName: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword,
                    phone: formData.phone,
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
                    phone: formData.phone,
                  }}
                  onChange={update}
                  errors={errors}
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                />
              )}

              <Button onClick={handleNext} className="w-full cursor-pointer">
                Continue &rarr;
              </Button>
            </div>
          )}

          {/* Step 2: Full Details */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.submit && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.submit}</AlertDescription>
                </Alert>
              )}

              {/* Student: Social Profiles */}
              {formData.role === "student" && (
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Social Profiles
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                    <div className="relative">
                      <FaLinkedin className={inputIconClass} />
                      <Input
                        id="linkedinUrl"
                        type="url"
                        className="pl-8 h-9 text-xs"
                        placeholder="https://linkedin.com/in/your_name"
                        value={formData.linkedinUrl}
                        onChange={(e) => update("linkedinUrl", e.target.value)}
                      />
                    </div>
                    {errors.linkedinUrl && (
                      <p className="text-xs text-destructive">
                        {errors.linkedinUrl}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portfolioUrl">Portfolio URL</Label>
                    <div className="relative">
                      <Globe className={inputIconClass} />
                      <Input
                        id="portfolioUrl"
                        type="url"
                        className="pl-8 h-9 text-xs"
                        placeholder="https://your_name.com"
                        value={formData.portfolioUrl}
                        onChange={(e) => update("portfolioUrl", e.target.value)}
                      />
                    </div>
                    {errors.portfolioUrl && (
                      <p className="text-xs text-destructive">
                        {errors.portfolioUrl}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Alumni: Professional */}
              {formData.role === "alumni" && (
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Professional Details
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="currentRole">Current Role</Label>
                    <div className="relative">
                      <Briefcase className={inputIconClass} />
                      <Input
                        id="currentRole"
                        className="pl-8 h-9 text-xs"
                        placeholder="Software Engineer"
                        value={formData.currentRole}
                        onChange={(e) => update("currentRole", e.target.value)}
                      />
                    </div>
                    {errors.currentRole && (
                      <p className="text-xs text-destructive">
                        {errors.currentRole}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <div className="relative">
                      <Building2 className={inputIconClass} />
                      <Input
                        id="company"
                        className="pl-8 h-9 text-xs"
                        placeholder="Google"
                        value={formData.company}
                        onChange={(e) => update("company", e.target.value)}
                      />
                    </div>
                    {errors.company && (
                      <p className="text-xs text-destructive">
                        {errors.company}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Faculty: Professional */}
              {formData.role === "faculty" && (
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Professional Details
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="designation">
                      Designation <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Briefcase className={inputIconClass} />
                      <Input
                        id="designation"
                        className="pl-8 h-9 text-xs"
                        placeholder="Assistant Professor"
                        value={formData.designation}
                        onChange={(e) => update("designation", e.target.value)}
                      />
                    </div>
                    {errors.designation && (
                      <p className="text-xs text-destructive">
                        {errors.designation}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="officeLocation">Office Location</Label>
                    <div className="relative">
                      <MapPin className={inputIconClass} />
                      <Input
                        id="officeLocation"
                        className="pl-8 h-9 text-xs"
                        placeholder="Main Campus, Block A"
                        value={formData.officeLocation}
                        onChange={(e) =>
                          update("officeLocation", e.target.value)
                        }
                      />
                    </div>
                    {errors.officeLocation && (
                      <p className="text-xs text-destructive">
                        {errors.officeLocation}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <Separator />

              <AcademicDetails
                role={
                  formData.role as "student" | "alumni" | "faculty"
                }
                departments={departments}
                branches={filteredBranches}
                batchYears={
                  formData.role === "student"
                    ? studentBatchYears
                    : alumniBatchYears
                }
                selectedDepartment={formData.department}
                selectedBranch={formData.branch}
                selectedBatchYear={formData.batchYear}
                branchDisabled={branchAutoSelected}
                errors={errors}
                onDepartmentChange={handleCourseChange}
                onBranchChange={(v) => update("branch", v)}
                onBatchYearChange={(v) => update("batchYear", v)}
              />

              <Separator />

              <LocationSelector
                countries={safeCountries}
                states={safeStates}
                cities={safeCities}
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 cursor-pointer"
                >
                  &larr; Back
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Creating
                      Account
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-foreground font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
