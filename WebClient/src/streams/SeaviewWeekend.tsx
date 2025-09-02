import type { Event } from "@/components/Interfaces";
import WeeklyEvent from "@/components/WeeklyEvent";

const stream = "Seaview Weekend";

export function SeaviewWeekend({
  onEdit,
  onDelete,
}: {
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
}) {
  const days = ["Saturday", "Sunday"];
  return (
    <WeeklyEvent
      onEdit={onEdit}
      onDelete={onDelete}
      days={days}
      stream={stream}
    />
  );
}
