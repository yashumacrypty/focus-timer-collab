
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Workspace, Task, Sprint, TimeEntry } from '@/types';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// Default workspace and member data
const defaultMembers: User[] = [
  { id: '1', name: 'Jane Cooper', email: 'jane@example.com', avatar: '/placeholder.svg' },
  { id: '2', name: 'Wade Warren', email: 'wade@example.com', avatar: '/placeholder.svg' },
  { id: '3', name: 'Esther Howard', email: 'esther@example.com', avatar: '/placeholder.svg' },
];

const defaultWorkspace: Workspace = {
  id: 'ws-1',
  name: 'My Workspace',
  description: 'Default workspace',
  createdAt: new Date(),
  ownerId: '1',
  members: defaultMembers,
};

interface WorkspaceContextProps {
  workspace: Workspace;
  currentUser: User;
  sprints: Sprint[];
  currentSprint: Sprint;
  tasks: Task[];
  createSprint: (sprint: Partial<Sprint>) => Promise<void>;
  createTask: (task: Partial<Task>) => Promise<void>;
  updateTaskStatus: (taskId: string, status: 'todo' | 'progress' | 'done') => void;
  currentlyTracking: string | null;
  startTimeTracking: (taskId: string) => void;
  stopTimeTracking: (taskId: string) => void;
  elapsedTime: number;
}

const WorkspaceContext = createContext<WorkspaceContextProps | undefined>(undefined);

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Current user
  const [currentUser, setCurrentUser] = useState<User>({
    id: user?.id || 'default',
    name: user?.name || 'Guest User',
    email: user?.email || 'guest@example.com',
  });
  
  // Workspace state
  const [workspace, setWorkspace] = useState<Workspace>(defaultWorkspace);
  
  // Sprints state
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [currentSprint, setCurrentSprint] = useState<Sprint>({
    id: '',
    name: '',
    startDate: new Date(),
    endDate: new Date(),
    workspaceId: defaultWorkspace.id,
    tasks: [],
    isActive: false,
  });
  
  // Tasks state
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Time tracking state
  const [currentlyTracking, setCurrentlyTracking] = useState<string | null>(null);
  const [trackingStartTime, setTrackingStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  
  // Fetch user data
  useEffect(() => {
    if (user) {
      setCurrentUser({
        id: user.id,
        name: user.name || 'Unnamed User',
        email: user.email || '',
        avatar: user.avatar,
      });
    }
  }, [user]);
  
  // Fetch sprints data
  useEffect(() => {
    const fetchSprints = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('sprints')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const sprintsData: Sprint[] = data.map(sprint => ({
            id: sprint.id,
            name: sprint.name,
            startDate: new Date(sprint.start_date),
            endDate: new Date(sprint.end_date),
            workspaceId: sprint.workspace_id,
            isActive: sprint.is_active,
            tasks: [],
          }));
          
          setSprints(sprintsData);
          
          // Set current sprint to the active one or the most recent
          const activeSprint = sprintsData.find(sprint => sprint.isActive);
          if (activeSprint) {
            setCurrentSprint(activeSprint);
          } else if (sprintsData.length > 0) {
            setCurrentSprint(sprintsData[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching sprints:', error);
        toast({
          title: 'Error fetching sprints',
          description: 'Please try again later',
          variant: 'destructive',
        });
      }
    };
    
    fetchSprints();
  }, [user, toast]);
  
  // Fetch tasks data
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        if (data) {
          const tasksData: Task[] = data.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description || '',
            status: task.status as 'todo' | 'progress' | 'done',
            reporterId: task.reporter_id,
            doerId: task.doer_id || undefined,
            estimatedTime: task.estimated_time,
            sprintId: task.sprint_id,
            workspaceId: task.workspace_id,
            createdAt: new Date(task.created_at),
            updatedAt: new Date(task.updated_at),
            timeEntries: [],
            totalTimeSpent: 0,  // This will be calculated from time entries in a real app
          }));
          
          setTasks(tasksData);
          
          // Update the sprints with their tasks
          setSprints(prevSprints => 
            prevSprints.map(sprint => ({
              ...sprint,
              tasks: tasksData.filter(task => task.sprintId === sprint.id),
            }))
          );
          
          // Update current sprint tasks
          setCurrentSprint(prevSprint => ({
            ...prevSprint,
            tasks: tasksData.filter(task => task.sprintId === prevSprint.id),
          }));
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast({
          title: 'Error fetching tasks',
          description: 'Please try again later',
          variant: 'destructive',
        });
      }
    };
    
    fetchTasks();
  }, [user, toast]);
  
  // Time tracking interval
  useEffect(() => {
    let interval: number | undefined;
    
    if (currentlyTracking && trackingStartTime) {
      interval = window.setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - trackingStartTime.getTime()) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [currentlyTracking, trackingStartTime]);
  
  // Start time tracking
  const startTimeTracking = useCallback((taskId: string) => {
    if (currentlyTracking) {
      stopTimeTracking(currentlyTracking);
    }
    
    setCurrentlyTracking(taskId);
    setTrackingStartTime(new Date());
    setElapsedTime(0);
  }, [currentlyTracking]);
  
  // Stop time tracking and save the entry
  const stopTimeTracking = useCallback((taskId: string) => {
    if (!trackingStartTime) return;
    
    const endTime = new Date();
    const startTime = trackingStartTime;
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    
    if (duration < 1) return;
    
    const date = startTime.toISOString().split('T')[0];
    
    const newTimeEntry: TimeEntry = {
      id: `te-${Date.now()}`,
      taskId,
      startTime,
      endTime,
      duration,
      date,
    };
    
    setTimeEntries(prev => [...prev, newTimeEntry]);
    
    // Update task's total time spent
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              timeEntries: [...task.timeEntries, newTimeEntry],
              totalTimeSpent: task.totalTimeSpent + duration,
            }
          : task
      )
    );
    
    // Update current sprint if the task belongs to it
    setCurrentSprint(prevSprint => {
      const taskInSprint = prevSprint.tasks.find(task => task.id === taskId);
      
      if (taskInSprint) {
        return {
          ...prevSprint,
          tasks: prevSprint.tasks.map(task => 
            task.id === taskId 
              ? { 
                  ...task, 
                  timeEntries: [...task.timeEntries, newTimeEntry],
                  totalTimeSpent: task.totalTimeSpent + duration,
                }
              : task
          ),
        };
      }
      
      return prevSprint;
    });
    
    // Reset tracking state
    setCurrentlyTracking(null);
    setTrackingStartTime(null);
    setElapsedTime(0);
    
    // In a real app, we would save the time entry to the database here
  }, [trackingStartTime]);
  
  // Create a new sprint
  const createSprint = async (sprint: Partial<Sprint>) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to create a sprint',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const newSprint = {
        name: sprint.name || 'New Sprint',
        start_date: sprint.startDate?.toISOString() || new Date().toISOString(),
        end_date: sprint.endDate?.toISOString() || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        workspace_id: sprint.workspaceId || workspace.id,
        is_active: sprint.isActive || false,
        user_id: user.id,
      };
      
      const { data, error } = await supabase
        .from('sprints')
        .insert(newSprint)
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        const createdSprint: Sprint = {
          id: data.id,
          name: data.name,
          startDate: new Date(data.start_date),
          endDate: new Date(data.end_date),
          workspaceId: data.workspace_id,
          isActive: data.is_active,
          tasks: [],
        };
        
        setSprints(prev => [createdSprint, ...prev]);
        
        // If this is the first sprint or it's active, set it as the current sprint
        if (sprints.length === 0 || createdSprint.isActive) {
          setCurrentSprint(createdSprint);
        }
        
        toast({
          title: 'Sprint created',
          description: `${createdSprint.name} has been created successfully`,
        });
      }
    } catch (error) {
      console.error('Error creating sprint:', error);
      toast({
        title: 'Error creating sprint',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };
  
  // Create a new task
  const createTask = async (task: Partial<Task>) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to create a task',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const newTask = {
        title: task.title || 'New Task',
        description: task.description || '',
        status: task.status || 'todo',
        reporter_id: task.reporterId || user.id,
        doer_id: task.doerId || null,
        estimated_time: task.estimatedTime || 3600, // Default to 1 hour in seconds
        sprint_id: task.sprintId || currentSprint.id,
        workspace_id: task.workspaceId || workspace.id,
        user_id: user.id,
      };
      
      const { data, error } = await supabase
        .from('tasks')
        .insert(newTask)
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        const createdTask: Task = {
          id: data.id,
          title: data.title,
          description: data.description || '',
          status: data.status as 'todo' | 'progress' | 'done',
          reporterId: data.reporter_id,
          doerId: data.doer_id || undefined,
          estimatedTime: data.estimated_time,
          sprintId: data.sprint_id,
          workspaceId: data.workspace_id,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
          timeEntries: [],
          totalTimeSpent: 0,
        };
        
        setTasks(prev => [createdTask, ...prev]);
        
        // Update the current sprint if the task belongs to it
        if (createdTask.sprintId === currentSprint.id) {
          setCurrentSprint(prev => ({
            ...prev,
            tasks: [createdTask, ...prev.tasks],
          }));
        }
        
        // Update sprints
        setSprints(prevSprints => 
          prevSprints.map(sprint => 
            sprint.id === createdTask.sprintId
              ? { ...sprint, tasks: [createdTask, ...sprint.tasks] }
              : sprint
          )
        );
        
        toast({
          title: 'Task created',
          description: `${createdTask.title} has been created successfully`,
        });
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: 'Error creating task',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };
  
  // Update task status
  const updateTaskStatus = async (taskId: string, status: 'todo' | 'progress' | 'done') => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', taskId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update tasks state
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId 
            ? { ...task, status } 
            : task
        )
      );
      
      // Update current sprint if the task belongs to it
      setCurrentSprint(prevSprint => ({
        ...prevSprint,
        tasks: prevSprint.tasks.map(task => 
          task.id === taskId 
            ? { ...task, status } 
            : task
        ),
      }));
      
      // Update sprints
      setSprints(prevSprints => 
        prevSprints.map(sprint => ({
          ...sprint,
          tasks: sprint.tasks.map(task => 
            task.id === taskId 
              ? { ...task, status } 
              : task
          ),
        }))
      );
      
      toast({
        title: 'Task updated',
        description: `Task status changed to ${status}`,
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      toast({
        title: 'Error updating task',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <WorkspaceContext.Provider
      value={{
        workspace,
        currentUser,
        sprints,
        currentSprint,
        tasks,
        createSprint,
        createTask,
        updateTaskStatus,
        currentlyTracking,
        startTimeTracking,
        stopTimeTracking,
        elapsedTime,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};
