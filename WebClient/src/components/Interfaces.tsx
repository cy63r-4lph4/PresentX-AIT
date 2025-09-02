export interface Event {
  id: number;
  title: string;
  hall_id: string;
  type: "recurring" | "one-time";
  date: string;
  end_date?: string;
  start_time: string;
  end_time: string;
  semester_id: number;
  streams: string[] | number[];
  description?: string;
  created_at: string;
  updated_at: string;
}
export interface EventFormData {
  title: string;
  hall_id: string;
  date: string;
  start_time: string;
  end_time: string;
  streams: string[];
  description?: string;
  type: "recurring" | "one-time";
}
export interface Session {
  name: string;
  range: number[];
  color: string;
}
export interface AddEventProps {
  open: boolean;
  onClose: () => void;
  onSave: (event: Event) => void;
}
export interface EventCardProps {
  session: Session;
  event: Event;
  hall:string;
  idx: number;
  stream: string;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
}
export interface SessionsMap {
  [key: string]: Session[];
}
export interface HallMap {
  [key: string]: string[];
}

export interface ActiveSessionBadgeProps {
  sessionName?: string;
  sessionColor?: string;
}

export interface EventModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (event: any) => void;
  event?: Event | null;
  pending?: boolean;
}
export interface StreamSelectorProps {
  selectedStreams: string[];
  toggleStream: (stream: string, checked: boolean) => void;
  eventStreams?: string[] | number[];
}
export interface UseEventsProps {
  Streams: string[];
}

export interface User {
  id: number;
  lecturer_id?: string;
  admin_id?: string;
  name: string;
  email: string;
  role: "admin" | "lecturer";
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User, user_type: string) => void;
  logout: () => void;
  loading: boolean;
}

export interface Campus {
  id: number;
  name: string;
}
export type Role = "admin" | "lecturer";

export interface ExtendedUser extends User {
  roles: Role[]; // supports multi-role users
}

export interface ExtendedAuthContextType {
  user: ExtendedUser | null;
  token: string | null;
  admin_token: string | null;
  lect_token: string | null;
  activeRole: Role | null;
  setActiveRole: (role: Role) => void;
  login: (token: string, user: User, user_type: Role) => void;
  logout: () => void;
  loading: boolean;
  switchRole: (role: Role) => void;
}

export interface SortedEventsProps {
  events: Event[] | undefined;
}

export interface Hall {
  id: number;
  name: string;
}
