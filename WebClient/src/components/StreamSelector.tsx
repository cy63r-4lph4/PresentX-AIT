import { ALL_STREAMS } from "./Constants";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { StreamSelectorProps } from "./Interfaces";
import { useEffect } from "react";
import { toast } from "react-toastify";

const StreamSelector: React.FC<StreamSelectorProps> = ({
  selectedStreams,
  toggleStream,
  eventStreams,
}) => {
  useEffect(() => {
    let parsedStreams: string[] = [];

    if (typeof eventStreams === "string") {
      try {
        parsedStreams = JSON.parse(eventStreams);
      } catch (e) {
        toast.error("Failed to parse event streams. Please check the format.");
        return;
      }
    } else if (Array.isArray(eventStreams)) {
      parsedStreams = eventStreams.filter((s): s is string => typeof s === "string");
    }

    parsedStreams.forEach((stream) => {
      if (ALL_STREAMS.includes(stream)) {
        toggleStream(stream, true);
      }
    });
  }, [eventStreams]);

  return (
    <div className="flex flex-wrap gap-4 mt-2">
      {ALL_STREAMS.map((stream) => (
        <div key={stream} className="flex items-center space-x-2">
          <Checkbox
            id={stream}
            checked={selectedStreams.includes(stream)}
            onCheckedChange={(checked: boolean) =>
              toggleStream(stream, checked)
            }
          />
          <Label htmlFor={stream}>{stream}</Label>
        </div>
      ))}
    </div>
  );
};

export default StreamSelector;
