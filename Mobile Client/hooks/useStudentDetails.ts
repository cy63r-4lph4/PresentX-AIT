import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface StudentDetails {
  student_id: string;
  name: string;
  email: string;
  phone: string;
  stream?: string | null;
  registered_courses_count: number;
  registered_courses: string[];
  created_at: string;
  [key: string]: any;
}

const fetchStudentDetails = async (): Promise<StudentDetails> => {
  try {
    const res = await api.get("/student/details");
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const useStudentDetails = () => {
  const {
    data: student,
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useQuery<StudentDetails>({
    queryKey: ["student-details"],
    queryFn: fetchStudentDetails,
  });

  return {
    student,
    loading,
    error: isError ? "Failed to fetch student details" : null,
    refetch,
  };
};
