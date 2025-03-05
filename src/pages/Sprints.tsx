
import React from 'react';
import { Layout } from '@/components/Layout';
import { SprintSummary } from '@/components/SprintSummary';
import { useWorkspace } from '@/context/WorkspaceContext';
import { CalendarDays, ListChecks } from 'lucide-react';

const Sprints = () => {
  const { currentSprint, tasks } = useWorkspace();
  
  const sprintTasks = tasks.filter(task => task.sprintId === currentSprint.id);
  const completedTasks = sprintTasks.filter(task => task.status === 'done');
  const progressPercentage = sprintTasks.length > 0 
    ? Math.floor((completedTasks.length / sprintTasks.length) * 100) 
    : 0;
  
  return (
    <Layout>
      <div className="mb-6 animate-slide-down">
        <h1 className="text-2xl font-semibold mb-1">Sprint Management</h1>
        <p className="text-muted-foreground">
          Track sprint progress and completion
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-5">
          <h3 className="text-base font-medium mb-4 flex items-center">
            <CalendarDays size={18} className="mr-2 text-focus" />
            Current Sprint
          </h3>
          
          <SprintSummary sprint={currentSprint} />
          
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Sprint Progress</h4>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-focus rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>{completedTasks.length} of {sprintTasks.length} tasks completed</span>
              <span>{progressPercentage}%</span>
            </div>
          </div>
        </div>
        
        <div className="glass-panel p-5">
          <h3 className="text-base font-medium mb-4 flex items-center">
            <ListChecks size={18} className="mr-2 text-focus" />
            Sprint Tasks
          </h3>
          
          {sprintTasks.length > 0 ? (
            <ul className="space-y-2">
              {sprintTasks.map(task => (
                <li key={task.id} className="p-3 bg-card rounded-md">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {task.description && task.description.length > 60
                          ? `${task.description.substring(0, 60)}...`
                          : task.description || 'No description'}
                      </p>
                    </div>
                    <div className={`status-badge status-badge-${task.status}`}>
                      {task.status === 'todo' ? 'To Do' : task.status === 'progress' ? 'In Progress' : 'Done'}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No tasks in current sprint
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Sprints;
