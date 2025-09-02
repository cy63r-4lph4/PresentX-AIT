import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // adjust import path as needed
import type { EventCardProps } from "./Interfaces";
import { GetSessionColor } from "@/hooks/utils";

const EventCard: React.FC<EventCardProps> = ({
  session,
  stream,
  event,
  hall,
  idx,
  onEdit,
  onDelete,
}) => {
  return (
    <Card
      key={idx}
      className={`border border-gray-200 pb-0 dark:border-gray-700 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ${GetSessionColor(
        session.name,
        stream
      )}`}
    >
      <CardContent className="p-4 space-y-2">
        <div className="font-semibold text-sm">{event.title}</div>
        <div className="text-xs text-muted-foreground">{hall}</div>
        <div className="text-xs text-muted-foreground">{`${event.start_time} - ${event.end_time}`}</div>

        <TooltipProvider>
          <div className="flex justify-end gap-2  border-t border-gray-100 dark:border-gray-800">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(event)}
                  className="hover:bg-muted/50"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Edit Event</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(event)}
                  className="hover:bg-muted/50"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Delete Event</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};

export default EventCard;
