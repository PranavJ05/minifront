"use client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Changed from 'next/router' to 'next/navigation' for App Router

interface OpportunityFormData {
  title: string;
  company: string;
  description: string;
  location: string;
  type: "JOB" | "INTERNSHIP" | "";
  applyLink: string;
  allowReferrals: boolean;
}

export default function NewOpportunityPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<OpportunityFormData>({
    title: "",
    company: "",
    description: "",
    location: "",
    type: "",
    applyLink: "",
    allowReferrals: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Basic validation
    if (
      !formData.title ||
      !formData.company ||
      !formData.description ||
      !formData.location ||
      !formData.type ||
      !formData.applyLink
    ) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      // In a real application, the token would be dynamically retrieved from an authentication context or local storage.
      // For demonstration purposes, I'm using the hardcoded token from your curl example.
      const token =
        "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2VAbWVjLmFjLmluIiwiaWF0IjoxNzc0MDc3MDE5LCJleHAiOjE3NzQxNjM0MTl9.4lfj_SGs05dnuLmK3yR3W4FQWJ9VvHQiS0GONme2DJU";

      const res = await fetch("http://localhost:8080/opportunities/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${res.status}`,
        );
      }

      setSuccess(true);
      // Optionally redirect after a short delay or show a success message
      setTimeout(() => {
        router.push("/opportunities");
      }, 2000);
    } catch (err: any) {
      console.error("Failed to create opportunity:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="bg-navy-950 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl font-bold text-white mb-2">
            Create New Opportunity
          </h1>
          <p className="text-gray-400">
            Share a new job or internship opportunity with the community.
          </p>
        </div>
      </div>

      <main className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="card p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-gray-700"
              >
                Company <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="company"
                id="company"
                value={formData.company}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                id="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                required
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                id="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700"
              >
                Type <span className="text-red-500">*</span>
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm rounded-md"
                required
              >
                <option value="">Select a type</option>
                <option value="JOB">Job</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="applyLink"
                className="block text-sm font-medium text-gray-700"
              >
                Application Link <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="applyLink"
                id="applyLink"
                value={formData.applyLink}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                placeholder="https://example.com/apply"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                id="allowReferrals"
                name="allowReferrals"
                type="checkbox"
                checked={formData.allowReferrals}
                onChange={handleChange}
                className="h-4 w-4 text-navy-600 focus:ring-navy-500 border-gray-300 rounded"
              />
              <label
                htmlFor="allowReferrals"
                className="ml-2 block text-sm text-gray-900"
              >
                Allow Referrals
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="w-full btn-primary py-2 px-4 inline-flex justify-center items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Create Opportunity"
                )}
              </button>
            </div>

            {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
              </div>
            )}

            {success && (
              <div
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <strong className="font-bold">Success!</strong>
                <span className="block sm:inline">
                  {" "}
                  Opportunity created successfully! Redirecting...
                </span>
              </div>
            )}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
