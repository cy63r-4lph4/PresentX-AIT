import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, ThumbsUp, ThumbsDown, Search } from "lucide-react";

interface Feedback {
  id: number;
  studentName: string;
  studentId: string;
  message: string;
  date: string;
  sentiment?: "positive" | "negative";
}

const sampleFeedback: Feedback[] = [
  {
    id: 1,
    studentName: "Alice Johnson",
    studentId: "ST12345",
    message: "The lectures are really engaging and clear!",
    date: "2025-08-08",
  },
  {
    id: 2,
    studentName: "Brian Smith",
    studentId: "ST56789",
    message: "The projector in room 204 isn’t working.",
    date: "2025-08-08",
  },
  {
    id: 3,
    studentName: "Chloe Adams",
    studentId: "ST98765",
    message: "I love the new attendance QR system!",
    date: "2025-08-07",
  },
];

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState(sampleFeedback);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSentiment = (id: number, sentiment: "positive" | "negative") => {
    setFeedbacks((prev) =>
      prev.map((f) => (f.id === id ? { ...f, sentiment } : f))
    );
  };

  const handleDelete = (id: number) => {
    setFeedbacks((prev) => prev.filter((f) => f.id !== id));
  };

  const filtered = feedbacks.filter(
    (f) =>
      f.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-600 text-transparent bg-clip-text">
          💬 Student Feedback
        </h2>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search feedback..."
            className="pl-10 rounded-xl border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-300 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-md text-center py-12">
            <p className="text-gray-500 text-lg">
              No feedback found for your search.
            </p>
          </Card>
        ) : (
          filtered.map((f) => (
            <Card
              key={f.id}
              className="border-0 shadow-lg hover:shadow-xl transition bg-white/70 backdrop-blur-lg"
            >
              <CardContent className="p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-gray-900">
                    {f.studentName}{" "}
                    <span className="text-sm text-gray-500">
                      ({f.studentId})
                    </span>
                  </p>
                  <p className="text-gray-700">{f.message}</p>
                  <p className="text-xs text-gray-400">📅 {f.date}</p>
                  {f.sentiment && (
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                        f.sentiment === "positive"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {f.sentiment === "positive" ? "Positive" : "Negative"}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-green-600 hover:bg-green-50"
                    onClick={() => handleSentiment(f.id, "positive")}
                  >
                    <ThumbsUp className="w-4 h-4 mr-1" /> Positive
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => handleSentiment(f.id, "negative")}
                  >
                    <ThumbsDown className="w-4 h-4 mr-1" /> Negative
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-gray-500 hover:bg-gray-100"
                    onClick={() => handleDelete(f.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
