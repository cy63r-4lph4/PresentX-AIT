import { CalendarDays, Clock, MapPin } from "lucide-react";
import { getWeekday } from "@/hooks/utils";
import { useMyEvents } from "@/hooks/GlobalHooks";
import type { Event } from "@/components/Interfaces";

export default function MyTimetable() {
  const { data: events, isLoading } = useMyEvents();

  const sortedEvents: Event[] = ((events: Event[] | undefined): Event[] => {
    return (events ?? []).sort((a: Event, b: Event) => {
      const dateA: string = a?.date ?? "";
      const dateB: string = b?.date ?? "";
      return dateA.localeCompare(dateB);
    });
  })(events);

  return (
    <div className="space-y-10">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3">
          <span className="text-5xl">📚</span>
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 animate-gradient">
            My Timetable
          </h2>
        </div>

        <p className="text-gray-500 mt-2 text-lg">
          See your scheduled classes in style
        </p>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-400 animate-pulse">
          Loading your events...
        </div>
      ) : sortedEvents.length === 0 ? (
        <div className="text-center text-gray-400 italic">
          No events assigned yet.
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {sortedEvents.map((event, idx) => (
            <div
              key={idx}
              className="relative bg-white/60 dark:bg-gray-900/50 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-transform hover:-translate-y-1"
            >
              <div className="absolute -top-3 -right-3 bg-gradient-to-br from-purple-600 to-pink-500 text-white text-xs font-bold py-1 px-3 rounded-full shadow-md">
                {getWeekday(event.date)}
              </div>

              <div className="mb-4">
                <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {event.description || "No description provided"}
                </p>
              </div>

              <div className="space-y-3 text-sm text-gray-800 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-indigo-500" />
                  <span className="font-medium">{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">
                    {event.start_time} - {event.end_time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-rose-500" />
                  <span className="font-medium">{event.hall_id || "TBA"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
