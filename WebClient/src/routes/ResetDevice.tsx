import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Loader2,
  Smartphone,
  Search,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

export function ResetDeviceScreen() {
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState<any>(null);

  // Simulated API Call
  const handleSearch = async () => {
    setLoading(true);
    setTimeout(() => {
      setStudentData({
        name: "Jane Doe",
        student_id: studentId,
        stream: "Computer Science",
        fingerprint: "A9:BF:23:98:Z7:CD",
      });
      setLoading(false);
    }, 1500);
  };

  const handleReset = () => {
    alert(`Fingerprint for ${studentData.name} has been reset ✅`);
    setStudentData(null);
    setStudentId("");
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center items-center gap-3">
          <span className="text-4xl">🔄</span>
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-500 to-blue-600 text-transparent bg-clip-text">
            Reset Student Device
          </h2>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
        <Input
          placeholder="Enter Student ID..."
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="w-full sm:w-96 rounded-xl border-gray-300 focus:ring-2 focus:ring-emerald-400"
        />
        <Button
          onClick={handleSearch}
          disabled={!studentId || loading}
          className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-medium px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            <Search className="h-5 w-5" />
          )}
          Search
        </Button>
      </div>

      {/* Student Info */}
      {studentData && (
        <Card className="max-w-lg mx-auto shadow-xl border border-emerald-100 rounded-2xl bg-white">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center gap-3">
              <Smartphone className="h-8 w-8 text-emerald-500" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {studentData.name}
                </h3>
                <p className="text-sm text-gray-500">
                  ID: {studentData.student_id}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-500">Stream</p>
              <p className="text-lg font-medium text-gray-800">
                {studentData.stream}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-500">
                Current Device Fingerprint
              </p>
              <p className="text-lg font-mono text-emerald-600">
                {studentData.fingerprint}
              </p>
            </div>

            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <p className="text-sm text-yellow-700">
                Resetting the fingerprint will allow the student to register a
                new device.
              </p>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              onClick={handleReset}
              className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold px-4 py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="h-5 w-5" />
              Reset Device Fingerprint
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
