import type { Event as CustomEvent } from "@/components/Interfaces";
import WeeklyEvent from "@/components/WeeklyEvent";

const stream = "KCC Evening";

export function KCCEvening({
  onEdit,
  onDelete,
}: {
  onEdit: (event: CustomEvent) => void;
  onDelete: (event: CustomEvent) => void;
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
