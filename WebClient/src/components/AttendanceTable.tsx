import { Card, CardContent } from "@/components/ui/card";

const methodColors = {
  all: "bg-gray-200 text-gray-800",
  qr: "bg-blue-100 text-blue-800 border border-blue-300",
  sms: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  scan: "bg-green-100 text-green-800 border border-green-300",
};

interface Student {
  id: number;
  name: string;
  student_id: string;
  stream: string;
  method: "all" | "qr" | "sms" | "scan";
  time: string;
}

export function AttendanceTable({ students }: { students: Student[] }) {
  return (
    <Card className="w-full shadow-md border border-muted bg-white/90 backdrop-blur-md rounded-2xl">
      <CardContent className="overflow-x-auto p-6">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-muted-foreground border-b border-muted pb-2">
              <th className="pb-3 font-semibold tracking-wide">Student Name</th>
              <th className="pb-3 font-semibold tracking-wide">Student ID</th>
              <th className="pb-3 font-semibold tracking-wide">Method</th>
              <th className="pb-3 font-semibold tracking-wide">Time Marked</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-muted-foreground">
                  No students found for this filter.
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <tr
                  key={s.id}
                  className="border-b last:border-0 hover:bg-muted/40 transition duration-200"
                >
                  <td className="py-3 font-medium">{s.name}</td>
                  <td className="py-3">{s.student_id}</td>
                  <td className="py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${methodColors[s.method]}`}
                    >
                      {s.method}
                    </span>
                  </td>
                  <td className="py-3">
                    {new Date(s.time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
