"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TABS = ["Upcoming", "My Events", "Past"] as const;
export type EventTab = (typeof TABS)[number];

interface EventTabsProps {
  active: EventTab;
  onChange: (tab: EventTab) => void;
}

export default function EventTabs({ active, onChange }: EventTabsProps) {
  return (
    <Tabs value={active} onValueChange={(v) => onChange(v as EventTab)}>
      <TabsList>
        {TABS.map((tab) => (
          <TabsTrigger key={tab} value={tab}>
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
