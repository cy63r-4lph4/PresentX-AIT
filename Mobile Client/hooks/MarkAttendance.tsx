import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const markAttendance = async (token: string): Promise<void> => {
  await api.post(`/attendance/mark`, { token });
};

export const useMarkAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todays-events"] });
    },
  });
};
