import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const markAttendance = async (eventId: string): Promise<void> => {
  await api.post(`/attendance/mark`, { eventId });
};

export const useMarkAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAttendance,
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ["todays-events"] });
    },
    // No onError — let caller handle it
  });
};
