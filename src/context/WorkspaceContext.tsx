
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, Workspace, Sprint, User, TaskStatus, TimeEntry } from '@/types';

// Demo data to simulate API responses
// In a real app, this would come from Supabase or another backend
const DEMO_USERS: User[] = [
  { id: 'u1', name: 'John Doe', email: 'john@example.com' },
  { id: 'u2', name: 'Jane Smith', email: 'jane@example.com' },
  { id: 'u3', name: 'Alex Johnson', email: 'alex@example.com' },
];

const DEMO_WORKSPACE: Workspace = {
  id: 'w1',
  name: 'Product Team',
  description: 'Main workspace for product development',
  createdAt: new Date('2023-01-01'),
  ownerId: 'u1',
  members: DEMO_USERS,
};

const CURRENT_SPRINT: Sprint = {
  id: 's1',
  name: 'Sprint 1',
  startDate: new Date(new Date().setDate(new Date().getDate() - 2)), // Started 2 days ago
  endDate: new Date(new Date().setDate(new Date().getDate() + 4)), // Ends in 4 days
  workspaceId: 'w1',
  tasks: [],
  isActive: true,
};

const DEMO_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Implement user authentication',
    description: 'Add login and registration functionality',
    status: 'progress',
    reporterId: 'u1',
    doerId: 'u2',
    estimatedTime: 14400, // 4 hours in seconds
    sprintId: 's1',
    workspaceId: 'w1',
    createdAt: new Date('2023-01-05'),
    updatedAt: new Date('2023-01-06'),
    timeEntries: [
      {
        id: 'e1',
        taskId: 't1',
        startTime: new Date(new Date().setHours(new Date().getHours() - 3)),
        endTime: new Date(new Date().setHours(new Date().getHours() - 1)),
        duration: 7200, // 2 hours
        date: new Date().toISOString().split('T')[0],
      }
    ],
    totalTimeSpent: 7200,
  },
  {
    id: 't2',
    title: 'Design landing page',
    description: 'Create mockups for the new landing page',
    status: 'todo',
    reporterId: 'u1',
    doerId: 'u3',
    estimatedTime: 18000, // 5 hours in seconds
    sprintId: 's1',
    workspaceId: 'w1',
    createdAt: new Date('2023-01-06'),
    updatedAt: new Date('2023-01-06'),
    timeEntries: [],
    totalTimeSpent: 0,
  },
  {
    id: 't3',
    title: 'Fix navigation bug',
    description: 'Address the issue with dropdown menu',
    status: 'done',
    reporterId: 'u2',
    doerId: 'u1',
    estimatedTime: 3600, // 1 hour in seconds
    sprintId: 's1',
    workspaceId: 'w1',
    createdAt: new Date('2023-01-03'),
    updatedAt: new Date('2023-01-04'),
    timeEntries: [
      {
        id: 'e2',
        taskId: 't3',
        startTime: new Date(new Date().setDate(new Date().getDate() - 1)),
        endTime: new Date(new Date().setDate(new Date().getDate() - 1)),
        duration: 4500, // 1 hour 15 minutes
        date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0],
      }
    ],
    totalTimeSpent: 4500,
  },
];

// Update the tasks in the sprint
CURRENT_SPRINT.tasks = DEMO_TASKS;

interface WorkspaceContextType {
  currentUser: User;
  workspace: Workspace;
  currentSprint: Sprint;
  tasks: Task[];
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'timeEntries' | 'totalTimeSpent'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  startTimeTracking: (taskId: string) => void;
  stopTimeTracking: (taskId: string) => void;
  currentlyTracking: string | null;
  trackingStartTime: Date | null;
  elapsedTime: number;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser] = useState<User>(DEMO_USERS[0]); // First user is current user
  const [workspace] = useState<Workspace>(DEMO_WORKSPACE);
  const [currentSprint] = useState<Sprint>(CURRENT_SPRINT);
  const [tasks, setTasks] = useState<Task[]>(DEMO_TASKS);
  
  const [currentlyTracking, setCurrentlyTracking] = useState<string | null>(null);
  const [trackingStartTime, setTrackingStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  
  // Timer effect for tracking elapsed time
  useEffect(() => {
    let intervalId: number;
    
    if (currentlyTracking && trackingStartTime) {
      intervalId = window.setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - trackingStartTime.getTime()) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [currentlyTracking, trackingStartTime]);
  
  // Create a new task
  const createTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'timeEntries' | 'totalTimeSpent'>) => {
    const newTask: Task = {
      ...task,
      id: `t${tasks.length + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      timeEntries: [],
      totalTimeSpent: 0,
    };
    
    setTasks([...tasks, newTask]);
  };
  
  // Update an existing task
  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, ...updates, updatedAt: new Date() } 
        : task
    ));
  };
  
  // Update task status
  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    updateTask(taskId, { status });
  };
  
  // Start time tracking for a task
  const startTimeTracking = (taskId: string) => {
    // Stop any current tracking first
    if (currentlyTracking) {
      stopTimeTracking(currentlyTracking);
    }
    
    setCurrentlyTracking(taskId);
    const now = new Date();
    setTrackingStartTime(now);
    setElapsedTime(0);
  };
  
  // Stop time tracking and save time entry
  const stopTimeTracking = (taskId: string) => {
    if (!trackingStartTime || taskId !== currentlyTracking) return;
    
    const now = new Date();
    const duration = Math.floor((now.getTime() - trackingStartTime.getTime()) / 1000);
    
    if (duration < 5) {
      // Ignore very short tracking periods (less than 5 seconds)
      setCurrentlyTracking(null);
      setTrackingStartTime(null);
      setElapsedTime(0);
      return;
    }
    
    const newTimeEntry: TimeEntry = {
      id: `e${Math.random().toString(36).substr(2, 9)}`,
      taskId,
      startTime: trackingStartTime,
      endTime: now,
      duration,
      date: now.toISOString().split('T')[0],
    };
    
    // Update tasks with the new time entry
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedTimeEntries = [...task.timeEntries, newTimeEntry];
        const totalTimeSpent = updatedTimeEntries.reduce((total, entry) => total + entry.duration, 0);
        
        return {
          ...task,
          timeEntries: updatedTimeEntries,
          totalTimeSpent,
          updatedAt: new Date(),
        };
      }
      return task;
    }));
    
    setCurrentlyTracking(null);
    setTrackingStartTime(null);
    setElapsedTime(0);
  };
  
  return (
    <WorkspaceContext.Provider
      value={{
        currentUser,
        workspace,
        currentSprint,
        tasks,
        createTask,
        updateTask,
        updateTaskStatus,
        startTimeTracking,
        stopTimeTracking,
        currentlyTracking,
        trackingStartTime,
        elapsedTime,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
