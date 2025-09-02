import Error from "@/components/Error";
import EventCard from "@/components/EventCard";
import type { Event, Campus, Hall } from "@/components/Interfaces";
import IsLoading from "@/components/IsLoading";
import NoEvent from "@/components/NoEvent";
import { useEvents } from "@/hooks/GlobalHooks";
import { GetSessionName, getWeekday, ParseTime } from "@/hooks/utils";
import { SESSIONS } from "./Constants";
import { toast } from "react-toastify";
import axios from "axios";
import { useHall, useCampuses } from "@/hooks/GlobalHooks";
import { useMemo } from "react";

const WeeklyEvent = ({
  onEdit,
  onDelete,
  stream,
  days,
}: {
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
  stream: string;
  days: string[];
}) => {
  const { data: events, isLoading, error } = useEvents({ Streams: [stream] });

  const campusNames = useMemo(() => {
    const names = [stream].map((s) => s.split(" ")[0]);
    return [...new Set(names)];
  }, [stream]);

  const { data: campuses = [] } = useCampuses();
  const campusIds = useMemo(() => {
    return campusNames
      .map(
        (name) =>
          campuses.find((c: Campus) =>
            c.name.toLowerCase().includes(name.toLowerCase())
          )?.id
      )
      .filter(Boolean);
  }, [campusNames, campuses]);

  const { data: halls = [] } = useHall({ campuses: campusIds });

  if (isLoading) {
    return <IsLoading />;
  }

  if (error) {
    const errWithResponse = error as Error & { response?: { status?: number } };
    if (errWithResponse.response?.status === 401) {
      toast.error("Unauthorized access. Please log in again.");
      const logout = () => {
        localStorage.removeItem("admin_auth_token");
        localStorage.removeItem("admin_auth_user");
        localStorage.removeItem("lect_auth_token");
        localStorage.removeItem("lect_auth_user");
        // Remove the Authorization header from axios
        delete axios.defaults.headers.common["Authorization"];
      };
      logout();
      window.location.href = "/";
      return;
    }
    return <Error message={error.message} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-6">
      {events?.length === 0 ? (
        <NoEvent />
      ) : (
        days.map((day) => {
          const dayEvents = (events ?? []).filter(
            (e) => getWeekday(e.date) === day
          );
          const sessionGroups: { [key: string]: typeof events } = {};
          dayEvents.forEach((event) => {
            const start = ParseTime(event.start_time);
            const sessionName = GetSessionName(start, stream);

            if (!sessionGroups[sessionName]) {
              sessionGroups[sessionName] = [];
            }

            sessionGroups[sessionName].push(event);
          });

          return (
            <div key={day} className="space-y-4">
              <h3 className="font-semibold text-xl text-gray-800 dark:text-white">
                {day}
              </h3>

              {Array.isArray(SESSIONS[stream]) &&
                SESSIONS[stream]?.map((session) => (
                  <div key={session.name} className="space-y-2">
                    {(sessionGroups[session.name]?.length ?? 0) > 0 && (
                      <div className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                        {session.name} Session
                      </div>
                    )}

                    {(sessionGroups[session.name] || [])
                      .sort((a, b) => a.title.localeCompare(b.title))
                      .map((event, idx) => {
                        const hallName =
                          halls.find(
                            (hall: Hall) =>
                              String(hall.id) === String(event.hall_id)
                          )?.name ?? "Unknown Hall";
                        return (
                          <EventCard
                            key={idx}
                            session={session}
                            stream={stream}
                            event={event}
                            hall={hallName}
                            idx={idx}
                            onEdit={onEdit}
                            onDelete={onDelete}
                          />
                        );
                      })}
                  </div>
                ))}
            </div>
          );
        })
      )}
    </div>
  );
};

export default WeeklyEvent;
