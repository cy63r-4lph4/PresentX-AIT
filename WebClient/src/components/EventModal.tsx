import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Edit,
  LayoutGrid,
  Loader2,
  Plus,
  Repeat,
  Settings,
} from "lucide-react";

import {
  GetSessionColor,
  GetSessionName,
  GetTimeFromRange,
  GetTimeRangeFromStart,
  ParseTime,
} from "@/hooks/utils";
import type {
  Campus,
  Event,
  EventFormData,
  EventModalProps,
  Hall,
} from "./Interfaces";
import { SESSIONS, streamIdToNameMap } from "./Constants";
import StreamSelector from "./StreamSelector";
import ActiveSessionBadge from "./ActiveSessionBadge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { useCampuses, useCourses, useHall } from "@/hooks/GlobalHooks";
const EventModal: React.FC<EventModalProps> = ({
  open,
  onClose,
  onSave,
  event,
  pending,
}) => {
  const [form, setForm] = useState<EventFormData>({
    title: "",
    hall_id: "",
    date: "",
    start_time: "08:30",
    end_time: "11:30",
    streams: [],
    description: "",
    type: "recurring",
  });
  useEffect(() => {
    if (!event) {
      setForm({
        title: "",
        hall_id: "",
        date: "",
        start_time: "08:30",
        end_time: "11:30",
        streams: [],
        description: "",
        type: "recurring",
      });
      setSelectedStreams([]);
      return;
    }
    

    const streamNames = (event.streams as number[])
      .map((id: number) => streamIdToNameMap[id])
      .filter(Boolean);
    setForm({
      ...event,
      streams: streamNames,
      hall_id: String(event.hall_id),
    });

    setSelectedStreams(streamNames);
  }, [event]);

  const [selectedStreams, setSelectedStreams] = useState<string[]>([]);
  const [sessionColor, setSessionColor] = useState<string>("");
  const [sessionName, setSessionName] = useState<string>("");
  const [usePresetSession, setUsePresetSession] = useState(false);
  const { data: campuses = [] } = useCampuses();
  const { data: courses = [] } = useCourses();

  const campusNames = useMemo(() => {
    const names = selectedStreams.map((stream) => stream.split(" ")[0]);
    return [...new Set(names)];
  }, [selectedStreams]);

  const campusIds = useMemo(() => {
    return campusNames
      .map((name) => {
        const match = campuses.find((c: Campus) =>
          c.name.toLowerCase().includes(name.toLowerCase())
        );
        return match?.id;
      })
      .filter(Boolean);
  }, [campusNames, campuses]);
  const { data: halls = [] } = useHall({
    campuses: campusIds,
  });

  const lectureHalls = halls;

  const sessionTime = useMemo(() => {
    return selectedStreams
      .map((stream) => SESSIONS[stream as keyof typeof SESSIONS])
      .filter(Boolean)
      .flat();
  }, [selectedStreams]);
  useEffect(() => {
    if (!form.start_time || selectedStreams.length === 0) {
      setSessionName("");
      setSessionColor("");
      return;
    }

    const startDecimal = ParseTime(form.start_time);
    const stream = selectedStreams[0];
    const session = GetSessionName(startDecimal, stream);
    const color = GetSessionColor(session, stream);

    setSessionName(session);
    setSessionColor(color);
  }, [form.start_time, selectedStreams]);

  const filteredCourses = useMemo(() => {
    if (!form.title) return [];

    const lower = form.title.toLowerCase();
    return courses.filter((c: string) => c.toLowerCase().includes(lower));
  }, [form.title, courses]);

  useEffect(() => {
    if (!lectureHalls.includes(form.hall_id)) {
      setForm((prev) => ({ ...prev, hall: "" }));
    }
  }, [selectedStreams]);

  useEffect(() => {
    if (!sessionTime.length) return;
    if (event) return;

    const firstRange = sessionTime[0].range;
    const formattedRange = GetTimeFromRange(firstRange);
    const [startTime, endTime] = formattedRange.split(" - ");

    if (form.start_time !== startTime) {
      setForm((prev) => ({
        ...prev,
        start_time: startTime,
        end_time: endTime,
      }));
    }
  }, [selectedStreams]);

  const uniqueSessions = useMemo(() => {
    const seen = new Set();
    return sessionTime.filter((s) => {
      if (seen.has(s.name)) return false;
      seen.add(s.name);
      return true;
    });
  }, [sessionTime]);

  const uniquehalls = useMemo(() => {
    const seen = new Set();
    return lectureHalls.filter((s: { id: number; name: string }) => {
      if (seen.has(s.id)) return false;
      seen.add(s.id);
      return true;
    });
  }, [sessionTime, halls]);

  const handleChange = (field: keyof typeof form) => (e: any) => {
    const value = e?.target?.value ?? e;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleStream = useCallback((stream: string, checked: boolean) => {
    setSelectedStreams((prev) =>
      checked ? [...prev, stream] : prev.filter((s) => s !== stream)
    );
  }, []);

  const validateForm = (form: Event | EventFormData): string | null => {
    const { title, streams = [], date, start_time, end_time } = form;

    if (!title.trim()) return "Please enter a title.";
    if (!form.hall_id) return "Please select a lecture hall.";
    if (streams.length === 0) return "Please select at least one stream.";
    if (!date) return "Please select a date.";
    if (!start_time || !end_time) return "Please select start and end times.";
    if (end_time <= start_time) return "End time must be after start time.";

    return null;
  };

  const handleSave = () => {
    form.streams = selectedStreams;
    const error = validateForm(form);
    if (error) return toast.error(error);

    onSave?.(form);
  };
 

  const hallName: string =
    uniquehalls.find((hall: Hall) => hall.id.toString() === form.hall_id)?.name ??
    "Lecture Hall";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl p-6 space-y-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            {event ? (
              <>
                <Edit className="w-5 h-5 text-primary" /> Edit Timetable
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 text-primary" />
                Add New Timetable Entry
              </>
            )}
          </DialogTitle>
          <div className="inline-flex border rounded-lg overflow-hidden">
            <Button
              variant={usePresetSession ? "default" : "ghost"}
              onClick={() => setUsePresetSession(true)}
              className={`rounded-none ${
                usePresetSession ? "bg-primary text-white" : "bg-muted"
              }`}
            >
              <LayoutGrid className="w-4 h-4 mr-2" /> Preset
            </Button>
            <Button
              variant={!usePresetSession ? "default" : "ghost"}
              onClick={() => setUsePresetSession(false)}
              className={`rounded-none ${
                !usePresetSession ? "bg-primary text-white" : "bg-muted"
              }`}
            >
              <Settings className="w-4 h-4 mr-2" />
              Manual
            </Button>
          </div>
        </DialogHeader>
        <Card>
          <CardContent className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., CSC101"
                  value={form.title}
                  onChange={handleChange("title")}
                  autoComplete="off"
                />
                {filteredCourses.length > 0 && (
                  <ul className="absolute bg-white border rounded shadow mt-1 z-10">
                    {filteredCourses.map((course: string, idx: number) => (
                      <li
                        key={idx}
                        className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleChange("title")(course)}
                      >
                        {course}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <Label htmlFor="hall">Lecture Hall</Label>
                <Select
                  disabled={lectureHalls.length === 0 || pending}
                  value={form.hall_id ?? ""}
                  onValueChange={handleChange("hall_id")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose Hall" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniquehalls.map((hall: { id: number; name: string }) => (
                      <SelectItem key={hall.id} value={hall.id.toString()}>
                        {hall.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              {" "}
              <Label>Stream(s)</Label>
              {event ? (
                <StreamSelector
                  selectedStreams={selectedStreams}
                  toggleStream={toggleStream}
                  eventStreams={event.streams}
                />
              ) : (
                <StreamSelector
                  selectedStreams={selectedStreams}
                  toggleStream={toggleStream}
                />
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange("date")}
                />
              </div>
              {usePresetSession ? (
                <div>
                  <Label htmlFor="Session">Session</Label>
                  <Select
                    value={
                      form.start_time && selectedStreams[0]
                        ? GetTimeRangeFromStart(
                            form.start_time,
                            selectedStreams[0]
                          )
                        : ""
                    }
                    onValueChange={(value) => {
                      const [start_time, end_time] = value.split(" - ");
                      setForm((prev) => ({ ...prev, start_time, end_time }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose Session" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueSessions.map((s, idx) => (
                        <SelectItem key={idx} value={GetTimeFromRange(s.range)}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start">Start Time</Label>
                    <Input
                      id="start"
                      type="time"
                      value={form.start_time}
                      onChange={handleChange("start_time")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end">End Time</Label>
                    <Input
                      id="end"
                      type="time"
                      value={form.end_time}
                      onChange={handleChange("end_time")}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional notes about this session..."
                value={form.description}
                onChange={handleChange("description")}
              />
            </div>

            <TooltipProvider>
              <div className="flex items-center space-x-3 border-t border-gray-100 dark:border-gray-800">
                <Checkbox
                  id="type"
                  checked={form.type === "recurring"}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      type: checked === true ? "recurring" : "one-time",
                    }))
                  }
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Label
                      htmlFor="recurring"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Repeat className="w-4 h-4" />
                      Repeat weekly
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-black text-white px-2 py-1 rounded shadow-sm text-sm"
                  >
                    <p>
                      If unchecked,the event will be considered a one-time event
                      (eg. seminar)
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>

            <ActiveSessionBadge
              sessionName={sessionName}
              sessionColor={sessionColor + " animate-pulse"}
            />

            <div>
              <Label className="block mb-2 text-sm">Preview</Label>
              <Card className={`border ${sessionColor}`}>
                <CardContent className="p-3 space-y-1 text-sm">
                  <div className="font-medium">
                    {form.title || "Course Title"}
                  </div>
                  <div className="text-muted-foreground">{hallName}</div>
                  <div>
                    {form.date || "No date"} | {form.start_time || "--:--"} -{" "}
                    {form.end_time || "--:--"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {selectedStreams.join(", ") || "No streams"}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                onClick={handleSave}
                disabled={pending || !form.title || !form.date}
                className={cn(
                  "flex items-center gap-2",
                  pending && "cursor-wait"
                )}
              >
                {pending && (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                )}
                {event ? "Update Event" : "Save Event"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
