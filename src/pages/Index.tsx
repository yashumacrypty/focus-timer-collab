
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { TaskCard } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';
import { TimeTracker } from '@/components/TimeTracker';
import { useWorkspace } from '@/context/WorkspaceContext';
import { TaskStatus } from '@/types';
import { Plus, Filter, Check, Clock, Search } from 'lucide-react';

const Index = () => {
  const { workspace, tasks, currentSprint } = useWorkspace();
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter tasks by priority and limit to recent ones
  const priorityTasks = tasks
    .filter(task => task.status !== 'done')
    .sort((a, b) => {
      // Sort by status (in progress first)
      if (a.status === 'progress' && b.status !== 'progress') return -1;
      if (a.status !== 'progress' && b.status === 'progress') return 1;
      // Then by most recently updated
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    })
    .slice(0, 5); // Limit to 5 tasks
  
  return (
    <Layout>
      <div className="mb-6 animate-slide-down">
        <h1 className="text-2xl font-semibold mb-1">Focus To-Do</h1>
        <p className="text-muted-foreground">
          Track your tasks and time with your team
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left column - Tasks */}
        <div className="md:col-span-7 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-medium">Priority Tasks</h2>
            <button 
              className="btn-focus flex items-center text-sm"
              onClick={() => setIsCreatingTask(true)}
            >
              <Plus size={16} className="mr-1" />
              New Task
            </button>
          </div>
          
          {priorityTasks.length > 0 ? (
            <ul className="space-y-4">
              {priorityTasks.map((task) => (
                <li key={task.id}>
                  <TaskCard task={task} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="bg-white shadow-card rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
                <Check size={20} className="text-accent-foreground" />
              </div>
              <h3 className="text-base font-medium mb-2">All caught up!</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                You don't have any pending tasks.
              </p>
              <button 
                className="btn-focus text-sm"
                onClick={() => setIsCreatingTask(true)}
              >
                Create a new task
              </button>
            </div>
          )}
        </div>
        
        {/* Right column - Time Tracker */}
        <div className="md:col-span-5 space-y-6">
          <TimeTracker />
        </div>
      </div>
      
      {isCreatingTask && (
        <TaskForm onClose={() => setIsCreatingTask(false)} />
      )}
    </Layout>
  );
};

export default Index;
