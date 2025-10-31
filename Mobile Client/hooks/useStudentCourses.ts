import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

// Define the Course interface (you can extend this as needed)
export interface Course {
  id: number;
  code: string;
  title: string;
  lecturer: string;
  stream_id?: number;
  [key: string]: any;
}

const fetchStudentCourses = async (): Promise<Course[]> => {
  try {
    const res = await api.get(`/student/courses`);
    return res.data.courses || [];
  } catch (err) {
    throw err;
  }
};

export const useStudentCourses = () => {
  const {
    data: courses = [],
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useQuery<Course[]>({
    queryKey: ["student-courses"],
    queryFn: fetchStudentCourses,
  });
  return {
    courses,
    loading,
    error: isError ? "Failed to fetch student courses" : null,
    refetch,
  };
};
