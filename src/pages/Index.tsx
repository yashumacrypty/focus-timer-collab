
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { TaskCard } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';
import { TimeTracker } from '@/components/TimeTracker';
import { SprintSummary } from '@/components/SprintSummary';
import { DailyInsights } from '@/components/DailyInsights';
import { MembersList } from '@/components/MembersList';
import { useWorkspace } from '@/context/WorkspaceContext';
import { TaskStatus } from '@/types';
import { Plus, Filter, Check, Clock, Search } from 'lucide-react';

const Index = () => {
  const { workspace, tasks, currentSprint } = useWorkspace();
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [taskFilter, setTaskFilter] = useState<TaskStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter and sort tasks
  const filteredTasks = tasks
    .filter(task => {
      // Filter by status
      if (taskFilter !== 'all' && task.status !== taskFilter) {
        return false;
      }
      
      // Filter by search
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const titleMatch = task.title.toLowerCase().includes(query);
        const descMatch = task.description?.toLowerCase().includes(query) || false;
        return titleMatch || descMatch;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by status priority: In Progress -> To Do -> Done
      const statusPriority = { progress: 0, todo: 1, done: 2 };
      return statusPriority[a.status] - statusPriority[b.status];
    });
  
  return (
    <WorkspaceProvider>
      <Layout>
        <div className="mb-6 animate-slide-down">
          <h1 className="text-2xl font-semibold mb-1">Focus To-Do</h1>
          <p className="text-muted-foreground">
            Track your tasks and time with your team
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-focus pl-10"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3">
                <select
                  value={taskFilter}
                  onChange={(e) => setTaskFilter(e.target.value as TaskStatus | 'all')}
                  className="select-focus !w-auto"
                >
                  <option value="all">All Tasks</option>
                  <option value="todo">To Do</option>
                  <option value="progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                
                <button 
                  className="btn-focus flex items-center"
                  onClick={() => setIsCreatingTask(true)}
                >
                  <Plus size={16} className="mr-2" />
                  New Task
                </button>
              </div>
            </div>
            
            {filteredTasks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="bg-white shadow-card rounded-lg p-8 text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={24} className="text-accent-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No tasks found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery 
                    ? "We couldn't find any tasks matching your search." 
                    : "You don't have any tasks yet."}
                </p>
                <button 
                  className="btn-focus"
                  onClick={() => {
                    setIsCreatingTask(true);
                    setSearchQuery('');
                    setTaskFilter('all');
                  }}
                >
                  Create your first task
                </button>
              </div>
            )}
            
            <DailyInsights tasks={tasks} />
          </div>
          
          <div className="space-y-6">
            <TimeTracker />
            <SprintSummary sprint={currentSprint} />
            <MembersList members={workspace.members} />
          </div>
        </div>
        
        {isCreatingTask && (
          <TaskForm onClose={() => setIsCreatingTask(false)} />
        )}
      </Layout>
    </WorkspaceProvider>
  );
};

// Wrap the component with WorkspaceProvider
import { WorkspaceProvider } from '@/context/WorkspaceContext';

export default Index;
