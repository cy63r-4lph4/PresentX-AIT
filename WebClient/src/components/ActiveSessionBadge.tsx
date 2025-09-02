import type { ActiveSessionBadgeProps } from "./Interfaces";


const ActiveSessionBadge = ({ sessionName, sessionColor }: ActiveSessionBadgeProps) => {
  return (
    <div className="text-sm text-muted-foreground">
      Auto Session:{" "}
      {sessionName ? (
        <span className={`px-2 py-1 rounded ${sessionColor}`}>
          {sessionName}
        </span>
      ) : (
        <span className="text-gray-400">Not set</span>
      )}
    </div>
  );
};

export default ActiveSessionBadge;
