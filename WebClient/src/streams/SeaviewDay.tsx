import type { Event } from "@/components/Interfaces";
import WeeklyEvent from "@/components/WeeklyEvent";

const stream = "Seaview Regular";

export function SeaviewDay({
  onEdit,
  onDelete,
}: {
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
}) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <WeeklyEvent
      onEdit={onEdit}
      onDelete={onDelete}
      days={days}
      stream={stream}
    />
  );
}
