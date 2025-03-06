
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, Workspace, Sprint, User, TaskStatus, TimeEntry } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface WorkspaceContextType {
  currentUser: User | null;
  workspace: Workspace;
  currentSprint: Sprint | null;
  sprints: Sprint[];
  tasks: Task[];
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'timeEntries' | 'totalTimeSpent'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  startTimeTracking: (taskId: string) => void;
  stopTimeTracking: (taskId: string) => void;
  currentlyTracking: string | null;
  trackingStartTime: Date | null;
  elapsedTime: number;
  createSprint: (sprint: Omit<Sprint, 'id' | 'tasks'>) => Promise<void>;
}

const DEFAULT_WORKSPACE: Workspace = {
  id: 'default',
  name: 'My Workspace',
  description: 'Personal workspace',
  createdAt: new Date(),
  ownerId: '',
  members: [],
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [workspace, setWorkspace] = useState<Workspace>(DEFAULT_WORKSPACE);
  const [currentSprint, setCurrentSprint] = useState<Sprint | null>(null);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const [currentlyTracking, setCurrentlyTracking] = useState<string | null>(null);
  const [trackingStartTime, setTrackingStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  
  // Initialize and load data when user changes
  useEffect(() => {
    if (!user) return;
    
    // Set basic user as current user and as a member of the workspace
    const currentUserObj: User = {
      id: user.id,
      name: user.name || '',
      email: user.email || '',
      avatar: user.avatar,
    };
    
    // Update workspace with the current user
    setWorkspace(prev => ({
      ...prev,
      ownerId: user.id,
      members: [currentUserObj]
    }));
    
    // Load user's sprints and tasks
    const loadUserData = async () => {
      try {
        // Load sprints
        const { data: sprintsData, error: sprintsError } = await supabase
          .from('sprints')
          .select('*')
          .eq('user_id', user.id)
          .order('start_date', { ascending: false });
        
        if (sprintsError) throw sprintsError;
        
        if (sprintsData && sprintsData.length > 0) {
          const formattedSprints: Sprint[] = sprintsData.map(sprint => ({
            id: sprint.id,
            name: sprint.name,
            startDate: new Date(sprint.start_date),
            endDate: new Date(sprint.end_date),
            workspaceId: workspace.id,
            isActive: sprint.is_active,
            tasks: []
          }));
          
          setSprints(formattedSprints);
          
          // Set the active sprint as current
          const activeSprint = formattedSprints.find(s => s.isActive);
          if (activeSprint) {
            setCurrentSprint(activeSprint);
          } else if (formattedSprints.length > 0) {
            // If no active sprint, use the most recent one
            setCurrentSprint(formattedSprints[0]);
          }
        }
        
        // Load tasks
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (tasksError) throw tasksError;
        
        if (tasksData) {
          const formattedTasks: Task[] = tasksData.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description || '',
            status: task.status as TaskStatus,
            reporterId: task.reporter_id,
            doerId: task.doer_id,
            estimatedTime: task.estimated_time,
            sprintId: task.sprint_id,
            workspaceId: workspace.id,
            createdAt: new Date(task.created_at),
            updatedAt: new Date(task.updated_at),
            timeEntries: [],
            totalTimeSpent: 0
          }));
          
          setTasks(formattedTasks);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your data',
          variant: 'destructive'
        });
      }
    };
    
    loadUserData();
  }, [user, toast]);
  
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
  
  // Create a new sprint
  const createSprint = async (sprint: Omit<Sprint, 'id' | 'tasks'>) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('sprints')
        .insert({
          name: sprint.name,
          start_date: sprint.startDate.toISOString(),
          end_date: sprint.endDate.toISOString(),
          workspace_id: sprint.workspaceId,
          is_active: sprint.isActive,
          user_id: user.id
        })
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const newSprint: Sprint = {
          id: data[0].id,
          name: data[0].name,
          startDate: new Date(data[0].start_date),
          endDate: new Date(data[0].end_date),
          workspaceId: data[0].workspace_id,
          isActive: data[0].is_active,
          tasks: []
        };
        
        setSprints(prev => [newSprint, ...prev]);
        
        if (newSprint.isActive) {
          setCurrentSprint(newSprint);
        }
        
        toast({
          title: 'Sprint created',
          description: `Sprint "${newSprint.name}" has been created.`,
        });
      }
    } catch (error) {
      console.error('Error creating sprint:', error);
      toast({
        title: 'Error',
        description: 'Failed to create sprint',
        variant: 'destructive'
      });
    }
  };
  
  // Create a new task
  const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'timeEntries' | 'totalTimeSpent'>) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: task.title,
          description: task.description,
          status: task.status,
          reporter_id: user.id,
          doer_id: task.doerId,
          estimated_time: task.estimatedTime,
          sprint_id: task.sprintId,
          workspace_id: task.workspaceId,
          user_id: user.id
        })
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const newTask: Task = {
          id: data[0].id,
          title: data[0].title,
          description: data[0].description || '',
          status: data[0].status as TaskStatus,
          reporterId: data[0].reporter_id,
          doerId: data[0].doer_id,
          estimatedTime: data[0].estimated_time,
          sprintId: data[0].sprint_id,
          workspaceId: data[0].workspace_id,
          createdAt: new Date(data[0].created_at),
          updatedAt: new Date(data[0].updated_at),
          timeEntries: [],
          totalTimeSpent: 0
        };
        
        setTasks(prev => [newTask, ...prev]);
        
        toast({
          title: 'Task created',
          description: `Task "${newTask.title}" has been created.`,
        });
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to create task',
        variant: 'destructive'
      });
    }
  };
  
  // Update an existing task
  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      // Create an object with only the database field names
      const dbUpdates: any = {};
      
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.doerId !== undefined) dbUpdates.doer_id = updates.doerId;
      if (updates.estimatedTime !== undefined) dbUpdates.estimated_time = updates.estimatedTime;
      if (updates.sprintId !== undefined) dbUpdates.sprint_id = updates.sprintId;
      
      const { error } = await supabase
        .from('tasks')
        .update(dbUpdates)
        .eq('id', taskId);
      
      if (error) throw error;
      
      // Update local state
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, ...updates, updatedAt: new Date() } 
          : task
      ));
      
      toast({
        title: 'Task updated',
        description: 'Task has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive'
      });
    }
  };
  
  // Update task status
  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    await updateTask(taskId, { status });
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
        currentUser: user,
        workspace,
        currentSprint,
        sprints,
        tasks,
        createTask,
        updateTask,
        updateTaskStatus,
        startTimeTracking,
        stopTimeTracking,
        currentlyTracking,
        trackingStartTime,
        elapsedTime,
        createSprint
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
