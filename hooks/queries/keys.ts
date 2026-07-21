export const queryKeys = {
  auth: {
    pendingStatus: (userId: number) => ["auth", "pending-status", userId] as const,
  },
  profile: {
    all: ["profile"] as const,
    me: () => ["profile", "me"] as const,
    update: () => ["profile", "update"] as const,
  },
  onboarding: {
    markWelcomeSeen: () => ["onboarding", "welcome-seen"] as const,
  },
  events: {
    all: ["events"] as const,
    detail: (id: number) => ["events", id] as const,
    mine: () => ["events", "mine"] as const,
  },
  alumni: {
    all: ["alumni"] as const,
    search: (params?: Record<string, string>) =>
      ["alumni", "search", params] as const,
    detail: (id: number) => ["alumni", id] as const,
  },
  opportunities: {
    all: ["opportunities"] as const,
    mine: () => ["opportunities", "mine"] as const,
  },
  mentorships: {
    all: ["mentorships"] as const,
    detail: (id: number) => ["mentorships", id] as const,
    applicants: (id: number) => ["mentorships", id, "applicants"] as const,
    finalMentees: (id: number) => ["mentorships", id, "final-mentees"] as const,
    my: () => ["mentorships", "mine"] as const,
    applicationStatus: (id: number) =>
      ["mentorships", id, "application-status"] as const,
  },
  sessions: {
    all: ["sessions"] as const,
    detail: (id: number) => ["sessions", id] as const,
    registrations: (id: number) => ["sessions", id, "registrations"] as const,
    media: (id: number) => ["sessions", id, "media"] as const,
  },
  clubEvents: {
    all: ["club-events"] as const,
    detail: (id: number) => ["club-events", id] as const,
    mine: () => ["club-events", "mine"] as const,
    edit: (id: number) => ["club-events", id, "edit"] as const,
  },
  skills: {
    all: ["skills"] as const,
    courses: () => ["courses"] as const,
    search: (q: string) => ["skills", "search", q] as const,
    pending: () => ["skills", "pending"] as const,
    alumni: (alumniId: number) => ["skills", "alumni", alumniId] as const,
    summary: (alumniId: number) =>
      ["skills", "alumni", alumniId, "summary"] as const,
  },
  admin: {
    pending: ["admin", "pending"] as const,
    users: (params?: Record<string, string>) =>
      ["admin", "users", params] as const,
    clubs: () => ["admin", "clubs"] as const,
  },
  location: {
    countries: ["location", "countries"] as const,
    states: (countryCode: string) =>
      ["location", "states", countryCode] as const,
    cities: (countryCode: string, stateCode: string) =>
      ["location", "cities", countryCode, stateCode] as const,
  },
  referrals: {
    mine: () => ["referrals", "mine"] as const,
    received: () => ["referrals", "received"] as const,
  },
  faculty: {
    all: ["faculty"] as const,
    detail: (id: number) => ["faculty", id] as const,
  },
  clubs: {
    my: () => ["clubs", "mine"] as const,
  },
  alumniApplications: {
    all: ["alumni-applications"] as const,
    pending: () => ["alumni-applications", "pending"] as const,
    detail: (id: number) => ["alumni-applications", id] as const,
  },
  privacy: {
    settings: () => ["privacy", "settings"] as const,
  },
};
