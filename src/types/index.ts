export type TaskStatus = 'todo' | 'progress' | 'done';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  motivation?: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  ownerId: string;
  members: User[];
}

export interface TimeEntry {
  id: string;
  taskId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
  date: string; // yyyy-MM-dd format for grouping by day
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  reporterId: string; // creator
  doerId?: string; // assignee
  reporter?: User;
  doer?: User;
  estimatedTime: number; // in seconds
  sprintId: string;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
  timeEntries: TimeEntry[];
  totalTimeSpent: number; // in seconds
}

export interface Sprint {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  workspaceId: string;
  tasks: Task[];
  isActive: boolean;
}

export interface DailyTimeLog {
  date: string; // yyyy-MM-dd
  totalTime: number; // in seconds
  tasks: {
    id: string;
    title: string;
    timeSpent: number; // in seconds
  }[];
}
