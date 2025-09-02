import { useState } from "react";
import { Plus, CalendarDays, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { KCCEvening, KCCWeekend, SeaviewDay, SeaviewWeekend } from "@/streams";
import type { Event } from "@/components/Interfaces";
import EventModal from "@/components/EventModal";
import {
  useCreateEvent,
  useDeleteEvent,
  useUpdateEvent,
} from "@/hooks/GlobalHooks";
import { toast } from "react-toastify";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


const streams = [
  {
    id: 1,
    name: "Seaview Regular",
    color: "bg-indigo-100 text-indigo-800",
    element: (
      onEdit: (event: Event) => void,
      onDelete: (event: Event) => void
    ) => <SeaviewDay onEdit={onEdit} onDelete={onDelete} />,
  },
  {
    id: 2,
    name: "Seaview Weekend",
    color: "bg-green-100 text-green-800",
    element: (
      onEdit: (event: Event) => void,
      onDelete: (event: Event) => void
    ) => <SeaviewWeekend onEdit={onEdit} onDelete={onDelete} />,
  },
  {
    id: 3,
    name: "KCC Evening",
    color: "bg-yellow-100 text-yellow-800",
    element: (
      onEdit: (event: Event) => void,
      onDelete: (event: Event) => void
    ) => <KCCEvening onEdit={onEdit} onDelete={onDelete} />,
  },
  {
    id: 4,
    name: "KCC Weekend",
    color: "bg-pink-100 text-pink-800",
    element: (
      onEdit: (event: Event) => void,
      onDelete: (event: Event) => void
    ) => <KCCWeekend onEdit={onEdit} onDelete={onDelete} />,
  },
];

export function Timetable() {
  const VIEW_MODES = {
    WEEKLY: "weekly",
    MONTHLY: "monthly",
  } as const;

  const [activeStream, setActiveStream] = useState(streams[0]);
  const [view, setView] = useState<
    (typeof VIEW_MODES)[keyof typeof VIEW_MODES]
  >(VIEW_MODES.WEEKLY);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { mutate: createEvent, isPending } = useCreateEvent();
  const { mutate: updateEvent, isPending: updatePending } = useUpdateEvent();
  const { mutate: deleteEvent } = useDeleteEvent();

  function onEdit(event: Event) {
    setSelectedEvent(event);
    setIsEditEventModalOpen(true);
  }
 function onDelete(event: Event) {
  confirmAlert({
    title: 'Confirm to delete',
    message: 'Are you sure you want to delete this event?',
    buttons: [
      {
        label: 'Yes',
        onClick: () => deleteEvent(event.id)
      },
      {
        label: 'No',
      }
    ]
  });
}
  function onAddEvent() {
    setIsAddEventModalOpen(true);
  }

  function onClose() {
    if (isEditEventModalOpen) {
      setIsEditEventModalOpen(false);
      setSelectedEvent(null);
    } else if (isAddEventModalOpen) {
      setIsAddEventModalOpen(false);
    }
  }

  function onSave(event: Event) {
    const isEdit = !!event.id;

    const handler = isEdit ? updateEvent : createEvent;

    handler(event, {
      onSuccess: (data) => {
        toast.success(data?.message || "Event saved successfully");

        if (isEdit) {
          setIsEditEventModalOpen(false);
          setSelectedEvent(null);
        } else {
          setIsAddEventModalOpen(false);
        }
      },
      onError: (error: any) => {
        if (error?.response?.status === 401) {
          toast.error("Unauthorized access. Please log in again.");
          // window.location.href = "/";
          return;
        }

        const errorMsg =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to save event";
        toast.error(errorMsg);
      },
    });
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold text-gray-900">
          Timetable Management
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant={view === "weekly" ? "default" : "ghost"}
            onClick={() => setView("weekly")}
            className="transition duration-200 ease-in-out transform hover:scale-105"
          >
            <LayoutGrid className="w-4 h-4 mr-2" /> Weekly
          </Button>
          <Button
            variant={view === "monthly" ? "default" : "ghost"}
            onClick={() => setView("monthly")}
            className="transition duration-200 ease-in-out transform hover:scale-105"
          >
            <CalendarDays className="w-4 h-4 mr-2" /> Monthly
          </Button>
          <Button variant="default" onClick={() => onAddEvent()}>
            <Plus className="w-4 h-4 mr-2" /> Add Event
          </Button>
        </div>
      </div>
      {/* Add Event */}
      {isAddEventModalOpen && (
        <EventModal
          open={isAddEventModalOpen}
          onClose={onClose}
          onSave={onSave}
          pending={isPending || updatePending}
        />
      )}
      {isEditEventModalOpen && (
        <EventModal
          open={isEditEventModalOpen}
          onClose={onClose}
          onSave={onSave}
          event={selectedEvent}
        />
      )}

      {/* Stream Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {streams.map((stream) => (
          <Card
            key={stream.id}
            className={cn(
              "cursor-pointer border-2 transition-all duration-200 transform hover:scale-105 shadow-lg",
              activeStream.name === stream.name
                ? "border-primary ring-2 ring-offset-2 ring-primary"
                : "border-transparent"
            )}
            onClick={() => setActiveStream(stream)}
          >
            <CardContent
              className={cn(
                "p-4 text-center rounded-md font-medium",
                stream.color
              )}
            >
              <span className="block mb-2 text-lg">{stream.name}</span>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Timetable Display */}
      <div className="mt-8">
        {view === "weekly" ? (
          activeStream.element(onEdit, onDelete)
        ) : (
          <div className="mt-6 text-center text-muted-foreground">
            <p className="text-lg">Monthly calendar view coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
