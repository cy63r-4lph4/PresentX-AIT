import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

/* -------------------------------------------------------------------------- */
/* Type Definitions                                                           */
/* -------------------------------------------------------------------------- */
export interface AttendanceStat {
  course: string;
  total_sessions_so_far: number;
  attended_sessions: number;
  attendance_percentage: number;
}

export interface AttendanceSummary {
  total_courses: number;
  overall_attendance: number;
}

export interface AttendanceStatsResponse {
  stats: AttendanceStat[];
  summary: AttendanceSummary;
}

/* -------------------------------------------------------------------------- */
/* API Fetcher                                                                */
/* -------------------------------------------------------------------------- */
const fetchAttendanceStats = async (): Promise<AttendanceStatsResponse> => {
  try {
    const res = await api.get(`/attendance/stats`);
    return res.data;
  } catch (err) {
    console.error("Error fetching attendance stats:", err);
    throw err;
  }
};

/* -------------------------------------------------------------------------- */
/* React Query Hook                                                           */
/* -------------------------------------------------------------------------- */
export const useAttendanceStats = () => {
  const {
    data,
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useQuery<AttendanceStatsResponse>({
    queryKey: ["attendance-stats"],
    queryFn: fetchAttendanceStats,
  });

  return {
    stats: data?.stats ?? [],
    summary: data?.summary ?? { total_courses: 0, overall_attendance: 0 },
    loading,
    error: isError ? "Failed to fetch attendance statistics" : null,
    refetch,
  };
};
