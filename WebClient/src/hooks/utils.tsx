import { SESSIONS } from "@/components/Constants";

export function ParseTime(time: string): number {
  const [hour, minute] = time.trim().split(":").map(Number);
  return hour + minute / 60;
}

export function GetSessionName(start: number, stream: string): string {
  const sessions = SESSIONS[stream] || [];
  const session = sessions.find(
    (s) => start >= s.range[0] && start < s.range[1]
  );
  return session?.name || "Other";
}
export function GetSessionColor(sessionName: string, stream: string): string {
  const sessions = SESSIONS[stream] || [];

  return (
    sessions.find((s) => s.name === sessionName)?.color || "bg-gray-300/30"
  );
}
export function GetTimeFromRange(range: number[]): string {
  const formatTime = (decimal: number): string => {
    const hours = Math.floor(decimal);
    const minutes = Math.round((decimal - hours) * 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const [start, end] = range;
  return `${formatTime(start)} - ${formatTime(end)}`;
}

export function UnParseTime(time: string): number {
  const [hour, minute] = time.trim().split(":").map(Number);
  return hour + minute / 60;
}
export function GetTimeRangeFromStart(start: string, stream: string): string {
  const parsedStart = UnParseTime(start);
  const Str = stream;
  const streamSessions = SESSIONS[Str];

  if (!streamSessions) return "00:00 - 00:00";

  const session = streamSessions.find(
    (s) => parsedStart >= s.range[0] && parsedStart < s.range[1]
  );
  if (session) {
    return GetTimeFromRange(session.range);
  }

  return "00:00 - 00:00";
}

export function getWeekday(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

export function getDuration(start: string, end: string): string {
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  const totalMinutes = Math.round((endTime - startTime) / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}
