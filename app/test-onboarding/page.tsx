"use client";

import { useState } from "react";
import SkillsOnboardingModal from "@/components/profile/SkillsOnboardingModal";

export default function TestOnboardingPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-navy-900 mb-4">
          Skills Onboarding Test Page
        </h1>

        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold text-navy-900 mb-4">
            Test Controls
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-navy-900 mb-2">
                Current State
              </h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
                {JSON.stringify(
                  {
                    token: localStorage.getItem("token") ? "***" : null,
                    alumni_user: JSON.parse(
                      localStorage.getItem("alumni_user") || "null",
                    ),
                    onboarding_completed: localStorage.getItem(
                      "skills_onboarding_completed",
                    ),
                    onboarding_skipped: localStorage.getItem(
                      "skills_onboarding_skipped",
                    ),
                  },
                  null,
                  2,
                )}
              </pre>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setIsOpen(true)} className="btn-primary">
                Open Onboarding Modal
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem("skills_onboarding_completed");
                  localStorage.removeItem("skills_onboarding_skipped");
                  alert("Onboarding state reset! Refresh to test again.");
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Reset Onboarding State
              </button>
            </div>

            <div>
              <h3 className="font-semibold text-navy-900 mb-2">API Test</h3>
              <button
                onClick={async () => {
                  const token = localStorage.getItem("token");
                  try {
                    const res = await fetch(
                      "http://localhost:8080/api/skills/starters?courseId=1",
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      },
                    );
                    const data = await res.json();
                    alert(`API Response: ${JSON.stringify(data, null, 2)}`);
                  } catch (err: any) {
                    alert(`API Error: ${err.message}`);
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Test Skills API
              </button>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-navy-900 mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Make sure you&apos;re logged in as an alumni user</li>
            <li>Click &quot;Open Onboarding Modal&quot; to test the modal</li>
            <li>
              Click &quot;Reset Onboarding State&quot; to clear completion flags
            </li>
            <li>
              Click &quot;Test Skills API&quot; to verify backend connection
            </li>
            <li>Check browser console for detailed logs</li>
          </ol>
        </div>
      </div>

      <SkillsOnboardingModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        alumniId={1} // Test with alumni ID 1
        courseId={1} // Test with course ID 1 (CS)
        onComplete={() => {
          alert("Onboarding completed!");
          setIsOpen(false);
        }}
      />

      <div className="card p-6 mt-6">
        <h2 className="text-xl font-bold text-navy-900 mb-4">
          Available Test Courses
        </h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            { id: 1, code: "CS", name: "Computer Science and Engineering" },
            {
              id: 2,
              code: "CSBS",
              name: "Computer Science and Business Systems",
            },
            {
              id: 3,
              code: "EC",
              name: "Electronics and Communication Engineering",
            },
            {
              id: 4,
              code: "EEE",
              name: "Electrical and Electronics Engineering",
            },
            {
              id: 5,
              code: "EB",
              name: "Electronics and Biomedical Engineering",
            },
            { id: 6, code: "EV", name: "Electronics Engineering (VLSI)" },
            { id: 7, code: "ME", name: "Mechanical Engineering" },
          ].map((course) => (
            <button
              key={course.id}
              onClick={() => {
                setIsOpen(true);
                console.log("Testing with course:", course);
              }}
              className="p-3 border border-gray-200 rounded-lg hover:border-gold-500 hover:bg-gold-50 text-left"
            >
              <span className="font-bold text-navy-900">{course.code}</span>
              <span className="text-sm text-gray-600 ml-2">{course.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
