// import { useEffect, useMemo, useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   CalendarClock,
//   LayoutGrid,
//   Plus,
//   Repeat,
//   Settings,
// } from "lucide-react";

// import {
//   GetSessionColor,
//   GetSessionName,
//   GetTimeFromRange,
//   GetTimeRangeFromStart,
//   ParseTime,
// } from "@/hooks/utils";
// import type { AddEventProps, Event } from "./Interfaces";
// import {
//   ALL_STREAMS_MAP_CAMPUS,
//   ALL_STREAMS_MAP_SESSION,
//   LECTURE_HALLS,
//   SESSIONS,
// } from "./Constants";
// import StreamSelector from "./StreamSelector";
// import ActiveSessionBadge from "./ActiveSessionBadge";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@radix-ui/react-tooltip";
// import { toast } from "react-toastify";

// const AddEventModal: React.FC<AddEventProps> = ({ open, onClose, onSave }) => {
//   const [form, setForm] = useState({
//     title: "",
//     hall: "",
//     date: "",
//     start: "08:30",
//     end: "11:30",
//     stream: [""],
//     description: "",
//     recurring: true,
//   });

//   const [selectedStreams, setSelectedStreams] = useState<string[]>([]);
//   const [sessionColor, setSessionColor] = useState<string>("");
//   const [sessionName, setSessionName] = useState<string>("");
//   const [usePresetSession, setUsePresetSession] = useState(false);

//   const lectureHalls = useMemo(() => {
//     return selectedStreams
//       .map((stream) => LECTURE_HALLS[ALL_STREAMS_MAP_CAMPUS[stream]])
//       .filter(Boolean)
//       .flat();
//   }, [selectedStreams]);

//   const sessionTime = useMemo(() => {
//     return selectedStreams
//       .map(
//         (stream) =>
//           SESSIONS[ALL_STREAMS_MAP_SESSION[stream] as keyof typeof SESSIONS]
//       )
//       .filter(Boolean)
//       .flat();
//   }, [selectedStreams]);
//   useEffect(() => {
//     if (!form.start || selectedStreams.length === 0) {
//       setSessionName("");
//       setSessionColor("");
//       return;
//     }

//     const startDecimal = ParseTime(form.start);
//     const stream = selectedStreams[0];
//     const session = GetSessionName(
//       startDecimal,
//       ALL_STREAMS_MAP_SESSION[stream]
//     );
//     const color = GetSessionColor(session, ALL_STREAMS_MAP_SESSION[stream]);

//     setSessionName(session);
//     setSessionColor(color);
//   }, [form.start, selectedStreams]);

//   useEffect(() => {
//     if (!lectureHalls.includes(form.hall)) {
//       setForm((prev) => ({ ...prev, hall: "" }));
//     }
//   }, [selectedStreams]);
//   useEffect(() => {
//     if (!sessionTime.length) return;

//     const firstRange = sessionTime[0].range;
//     const formattedRange = GetTimeFromRange(firstRange);
//     const [startTime] = formattedRange.split(" - ");

//     if (form.start !== startTime) {
//       setForm((prev) => ({ ...prev, start: "", end: "" }));
//     }
//   }, [selectedStreams]);

//   const uniqueSessions = useMemo(() => {
//     const seen = new Set();
//     return sessionTime.filter((s) => {
//       if (seen.has(s.name)) return false;
//       seen.add(s.name);
//       return true;
//     });
//   }, [sessionTime]);

//   const uniquehalls = useMemo(() => {
//     const seen = new Set();
//     return lectureHalls.filter((s) => {
//       if (seen.has(s)) return false;
//       seen.add(s);
//       return true;
//     });
//   }, [sessionTime]);

//   const handleChange = (field: keyof typeof form) => (e: any) => {
//     const value = e?.target?.value ?? e;
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const toggleStream = (stream: string, checked: boolean) => {
//     setSelectedStreams((prev) =>
//       checked ? [...prev, stream] : prev.filter((s) => s !== stream)
//     );
//   };

//   const validateForm = (
//     form: Event,
//   ): string | null => {
//     const { title, streams = [], date, start_time, end_time} = form;

//     if (!title.trim()) return "Please enter a title.";
//     if (!form.hall) return "Please select a lecture hall.";
//     if (streams.length === 0) return "Please select at least one stream.";
//     if (!date) return "Please select a date.";
//     if (!start_time || !end_time) return "Please select start and end times.";
//     if (end_time <= start_time) return "End time must be after start time.";
//     return null;
//   };

//   const handleSave = () => {
//     form.stream = selectedStreams;
//     const error = validateForm(form);
//     if (error) return toast.error(error);

//     const eventToSave = {
//       ...form,
//       time: `${form.start} - ${form.end}`,
//       day: form.date,
//     };

//     onSave?.(eventToSave);
//     onClose();
//   };

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="max-w-xl p-6 space-y-6 shadow-2xl">
//         <DialogHeader>
//           <DialogTitle className="text-xl font-semibold flex items-center gap-2">
//             <Plus className="w-5 h-5 text-primary" />
//             Add New Timetable Entry
//           </DialogTitle>
//           <div className="inline-flex border rounded-lg overflow-hidden">
//             <Button
//               variant={usePresetSession ? "default" : "ghost"}
//               onClick={() => setUsePresetSession(true)}
//               className={`rounded-none ${
//                 usePresetSession ? "bg-primary text-white" : "bg-muted"
//               }`}
//             >
//               <LayoutGrid className="w-4 h-4 mr-2" /> Preset
//             </Button>
//             <Button
//               variant={!usePresetSession ? "default" : "ghost"}
//               onClick={() => setUsePresetSession(false)}
//               className={`rounded-none ${
//                 !usePresetSession ? "bg-primary text-white" : "bg-muted"
//               }`}
//             >
//               <Settings className="w-4 h-4 mr-2" />
//               Manual
//             </Button>
//           </div>
//         </DialogHeader>

//         <Card>
//           <CardContent className="p-6 space-y-5">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               <div>
//                 <Label htmlFor="title">Course Title</Label>
//                 <Input
//                   id="title"
//                   placeholder="e.g., CSC101"
//                   value={form.title}
//                   onChange={handleChange("title")}
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="hall">Lecture Hall</Label>
//                 <Select value={form.hall} onValueChange={handleChange("hall")}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Choose Hall" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {uniquehalls.map((hall, idx) => (
//                       <SelectItem key={idx} value={hall}>
//                         {hall}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <div>
//               <Label>Stream(s)</Label>
//               <StreamSelector
//                 selectedStreams={selectedStreams}
//                 toggleStream={toggleStream}
//               />
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               <div>
//                 <Label htmlFor="date">Date</Label>
//                 <Input
//                   id="date"
//                   type="date"
//                   value={form.date}
//                   onChange={handleChange("date")}
//                 />
//               </div>
//               {usePresetSession ? (
//                 <div>
//                   <Label htmlFor="Session">Session</Label>
//                   <Select
//                     value={
//                       form.start && selectedStreams[0]
//                         ? GetTimeRangeFromStart(form.start, selectedStreams[0])
//                         : ""
//                     }
//                     onValueChange={(value) => {
//                       const [start, end] = value.split(" - ");
//                       setForm((prev) => ({ ...prev, start, end }));
//                     }}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Choose Session" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {uniqueSessions.map((s, idx) => (
//                         <SelectItem key={idx} value={GetTimeFromRange(s.range)}>
//                           {s.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="start">Start Time</Label>
//                     <Input
//                       id="start"
//                       type="time"
//                       value={form.start}
//                       onChange={handleChange("start")}
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="end">End Time</Label>
//                     <Input
//                       id="end"
//                       type="time"
//                       value={form.end}
//                       onChange={handleChange("end")}
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div>
//               <Label htmlFor="description">Description</Label>
//               <Textarea
//                 id="description"
//                 placeholder="Optional notes about this session..."
//                 value={form.description}
//                 onChange={handleChange("description")}
//               />
//             </div>

//             <TooltipProvider>
//               <div className="flex items-center space-x-3 border-t border-gray-100 dark:border-gray-800">
//                 <Checkbox
//                   id="recurring"
//                   checked={form.recurring}
//                   onCheckedChange={(checked) =>
//                     setForm((prev) => ({
//                       ...prev,
//                       recurring: checked === true,
//                     }))
//                   }
//                 />
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Label
//                       htmlFor="recurring"
//                       className="flex items-center gap-2 cursor-pointer"
//                     >
//                       <Repeat className="w-4 h-4" />
//                       Repeat weekly
//                     </Label>
//                   </TooltipTrigger>
//                   <TooltipContent
//                     side="top"
//                     className="bg-black text-white px-2 py-1 rounded shadow-sm text-sm"
//                   >
//                     <p>
//                       If unchecked,the event will be considered a one-time event
//                       (eg. seminar)
//                     </p>
//                   </TooltipContent>
//                 </Tooltip>
//               </div>
//             </TooltipProvider>

//             <ActiveSessionBadge
//               sessionName={sessionName}
//               sessionColor={sessionColor + " animate-pulse"}
//             />

//             <div>
//               <Label className="block mb-2 text-sm">Preview</Label>
//               <Card className={`border ${sessionColor}`}>
//                 <CardContent className="p-3 space-y-1 text-sm">
//                   <div className="font-medium">
//                     {form.title || "Course Title"}
//                   </div>
//                   <div className="text-muted-foreground">
//                     {form.hall || "Lecture Hall"}
//                   </div>
//                   <div className="text-muted-foreground">
//                     {form.start} - {form.end} • {form.date || "Date not set"}
//                   </div>
//                   <div className="text-muted-foreground">
//                     Streams:{" "}
//                     {selectedStreams.length > 0
//                       ? selectedStreams.join(", ")
//                       : "None selected"}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             <div className="flex justify-end">
//               <Button
//                 onClick={handleSave}
//                 className="mt-4 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 hover:bg-gradient-to-r hover:from-indigo-400 hover:to-purple-400 hover:text-indigo-800"
//               >
//                 <CalendarClock className="w-4 h-4 mr-2" /> Save Entry
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default AddEventModal;
