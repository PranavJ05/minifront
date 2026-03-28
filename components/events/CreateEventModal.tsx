"use client";

// components/events/CreateEventModal.tsx

import { useMemo, useState } from "react";
import { X, Loader2, CheckCircle2, CalendarPlus } from "lucide-react";
import { createEvent } from "@/lib/api/events";
import { getToken } from "@/lib/auth";

interface CreateEventModalProps {
  onClose: () => void;
  onCreated: () => void; // called after success so parent can refetch
}

type ModalState = "form" | "submitting" | "success" | "error";

export default function CreateEventModal({
  onClose,
  onCreated,
}: CreateEventModalProps) {
  const [state, setState] = useState<ModalState>("form");
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [batchYear, setBatchYear] = useState("");
  const [registrationRequired, setRegistrationRequired] = useState(false);
  const [registrationLink, setRegistrationLink] = useState("");

  const minDateTime = useMemo(() => {
    const now = new Date();
    const offsetMs = now.getTimezoneOffset() * 60 * 1000;
    return new Date(now.getTime() - offsetMs).toISOString().slice(0, 16);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !eventDate || !location) return;

    const selectedDate = new Date(eventDate);
    const now = new Date();

    if (selectedDate.getTime() < now.getTime()) {
      setError("Event date and time must be today or in the future.");
      setState("error");
      return;
    }

    setError("");
    setState("submitting");
    try {
      const token = getToken() ?? "";
      const res = await createEvent(
        {
          title,
          description,
          eventDate: new Date(eventDate).toISOString().slice(0, 19),
          location,
          batchYear: batchYear ? parseInt(batchYear) : 0,
          registrationRequired,
          registrationLink: registrationRequired ? registrationLink : undefined,
        },
        token,
      );

      if (!res.success) throw new Error(res.message);
      setState("success");
      onCreated();
    } catch (err: any) {
      setError(err.message || "Failed to create event.");
      setState("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-navy-950 px-6 py-5 flex items-center justify-between shrink-0">
          <div>
            <p className="text-navy-400 text-xs font-medium uppercase tracking-widest mb-0.5">
              Batch Admin
            </p>
            <h2 className="text-white font-serif text-xl font-bold">
              Create Event
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-navy-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {state === "success" ? (
            <div className="flex flex-col items-center text-center py-8 gap-4">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <h3 className="text-navy-900 font-bold text-lg">
                  Event Created!
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Your event has been published to the community.
                </p>
              </div>
              <button onClick={onClose} className="btn-primary px-8 mt-2">
                Done
              </button>
            </div>
          ) : state === "error" ? (
            <div className="flex flex-col items-center text-center py-8 gap-4">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                <X className="h-8 w-8 text-red-400" />
              </div>
              <div>
                <h3 className="text-navy-900 font-bold text-lg">
                  Creation Failed
                </h3>
                <p className="text-red-500 text-sm mt-1">{error}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setState("form")}
                  className="btn-primary px-6"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-200 rounded-lg text-gray-600 text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-navy-800 mb-1.5">
                  Event Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="MEC Alumni Reunion 2025"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent transition-all"
                  disabled={state === "submitting"}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy-800 mb-1.5">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe the event..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent resize-none transition-all"
                  disabled={state === "submitting"}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-navy-800 mb-1.5">
                    Date & Time <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                    min={minDateTime}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent transition-all"
                    disabled={state === "submitting"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-800 mb-1.5">
                    Batch Year
                  </label>
                  <input
                    type="number"
                    value={batchYear}
                    onChange={(e) => setBatchYear(e.target.value)}
                    placeholder="2019"
                    min="1980"
                    max="2030"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent transition-all"
                    disabled={state === "submitting"}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy-800 mb-1.5">
                  Location <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  placeholder="MEC Main Auditorium, Kochi — or — Online (Google Meet)"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent transition-all"
                  disabled={state === "submitting"}
                />
              </div>

              <div className="flex items-center gap-3 py-1">
                <button
                  type="button"
                  onClick={() => setRegistrationRequired((v) => !v)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    registrationRequired ? "bg-navy-700" : "bg-gray-200"
                  }`}
                  disabled={state === "submitting"}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      registrationRequired ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-sm font-medium text-navy-800">
                  Registration Required
                </span>
              </div>

              {registrationRequired && (
                <div>
                  <label className="block text-sm font-semibold text-navy-800 mb-1.5">
                    Registration Link
                  </label>
                  <input
                    type="url"
                    value={registrationLink}
                    onChange={(e) => setRegistrationLink(e.target.value)}
                    placeholder="https://forms.google.com/..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent transition-all"
                    disabled={state === "submitting"}
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={state === "submitting"}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {state === "submitting" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating…
                    </>
                  ) : (
                    <>
                      <CalendarPlus className="h-4 w-4" />
                      Create Event
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={state === "submitting"}
                  className="px-5 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
