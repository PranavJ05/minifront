"use client";

// components/events/EventTabs.tsx

const TABS = ["Upcoming", "My Events", "Past"] as const;
export type EventTab = (typeof TABS)[number];

interface EventTabsProps {
  active: EventTab;
  onChange: (tab: EventTab) => void;
}

export default function EventTabs({ active, onChange }: EventTabsProps) {
  return (
    <div className="flex gap-1 border-b border-gray-200 mb-8">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
            active === tab
              ? "border-navy-800 text-navy-900"
              : "border-transparent text-gray-500 hover:text-navy-700"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
