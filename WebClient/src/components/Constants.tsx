import type { SessionsMap } from "./Interfaces";

export const SESSIONS: SessionsMap = {
  "Seaview Regular": [
    { name: "Morning", range: [8, 11.5], color: "bg-indigo-200/30" },
    { name: "Afternoon", range: [11.75, 14.75], color: "bg-green-200/30" },
    { name: "Evening", range: [15, 18], color: "bg-yellow-200/30" },
    { name: "Other", range: [0, 24], color: "bg-gray-300/30" },
  ],
  "Seaview Weekend": [
    { name: "Morning", range: [7, 11.5], color: "bg-indigo-200/30" },
    { name: "Afternoon", range: [11.75, 14.75], color: "bg-green-200/30" },
    { name: "Evening", range: [15, 18], color: "bg-yellow-200/30" },
    { name: "Other", range: [0, 24], color: "bg-gray-300/30" },
  ],
  "KCC Evening": [
    { name: "Early", range: [17.3, 19.3], color: "bg-indigo-200/30" },
    { name: "Late", range: [19.55, 21.55], color: "bg-green-200/30" },
    { name: "Other", range: [0, 24], color: "bg-gray-300/30" },
  ],
  "KCC Weekend": [
    { name: "Morning", range: [8, 11.5], color: "bg-indigo-200/30" },
    { name: "Afternoon", range: [11.75, 14.75], color: "bg-green-200/30" },
    { name: "Evening", range: [15, 18], color: "bg-yellow-200/30" },
    { name: "Other", range: [0, 24], color: "bg-gray-300/30" },
  ],
};

export const ALL_STREAMS: string[] = [
  "Seaview Regular",
  "Seaview Weekend",
  "KCC Evening",
  "KCC Weekend",
];

export const STREAM_ID_TO_SESSION_KEY: Record<number, string> = {
  1: "SeaviewRegular",
  2: "SeaviewWeekend",
  3: "KCCEvening",
  4: "KCCWeekend",
};
export const streamIdToNameMap: Record<number, string> = {
  3: "KCC Weekend",
  2: "KCC Evening",
  4: "Seaview Weekend",
  1: "Seaview Regular",
};
