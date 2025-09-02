// import { useState } from "react";
// import { CalendarClock, Repeat, Plus } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";

// export function Timetable() {
//   const [streams, setStreams] = useState([
//     "Seaview Day",
//     "Seaview Weekend",
//     "KCC Evening",
//     "KCC Weekend",
//   ]);
//   const [lectureHalls, setLectureHalls] = useState(["LH1", "LH2", "LH3"]);
//   const [selectedStreams, setSelectedStreams] = useState<string[]>([]);

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
//           Timetable Management
//         </h2>
//         <Button size="sm" variant="default">
//           <Plus className="w-4 h-4 mr-2" />
//           Add Timetable Entry
//         </Button>
//       </div>

//       <Card>
//         <CardContent className="p-6 space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label htmlFor="title">Title</Label>
//               <Input id="title" placeholder="e.g., CSC101 Lecture" />
//             </div>

//             <div>
//               <Label htmlFor="hall">Lecture Hall</Label>
//               <Select>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select Hall" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {lectureHalls.map((hall, idx) => (
//                     <SelectItem key={idx} value={hall}>
//                       {hall}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label htmlFor="streams">Stream(s)</Label>
//               <div className="flex flex-col gap-1">
//                 {streams.map((stream) => (
//                   <div key={stream} className="flex items-center space-x-2">
//                     <Checkbox
//                       id={stream}
//                       checked={selectedStreams.includes(stream)}
//                       onCheckedChange={(checked) => {
//                         setSelectedStreams((prev) =>
//                           checked
//                             ? [...prev, stream]
//                             : prev.filter((s) => s !== stream)
//                         );
//                       }}
//                     />
//                     <Label htmlFor={stream} className="text-sm font-medium">
//                       {stream}
//                     </Label>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <Label htmlFor="date">Date</Label>
//               <Input id="date" type="date" />
//             </div>

//             <div>
//               <Label htmlFor="start-time">Start Time</Label>
//               <Input id="start-time" type="time" />
//             </div>

//             <div>
//               <Label htmlFor="end-time">End Time</Label>
//               <Input id="end-time" type="time" />
//             </div>
//           </div>

//           <div>
//             <Label htmlFor="description">Description</Label>
//             <Textarea
//               id="description"
//               placeholder="Optional notes about this class or session..."
//             />
//           </div>

//           <div className="flex items-center space-x-2">
//             <Checkbox id="recurring" />
//             <Label htmlFor="recurring" className="flex items-center gap-2">
//               <Repeat className="w-4 h-4" /> Recurring weekly
//             </Label>
//           </div>

//           <Button type="submit" className="mt-4 w-full md:w-fit">
//             <CalendarClock className="w-4 h-4 mr-2" /> Save Timetable Entry
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
