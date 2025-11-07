import { Event } from "@/components/Interfaces";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

const fetchTodaysEvents = async (): Promise<Event[]> => {
  try {
    const res = await api.get(`/events/today`);
    return res.data.events || [];
  } catch (err) {
    throw err;
  }
};

export const useTodaysEvents = () => {
  const {
    data: events = [],
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useQuery<Event[]>({
    queryKey: ["todays-events"],
    queryFn: fetchTodaysEvents,
  });
  return {
    events,
    loading,
    error: isError ? "Failed to fetch today's events" : null,
    refetch,
  };
};
