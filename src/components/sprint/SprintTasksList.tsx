
import React from 'react';
import { Task } from '@/types';
import { ListChecks } from 'lucide-react';

interface SprintTasksListProps {
  tasks: Task[];
}

export const SprintTasksList: React.FC<SprintTasksListProps> = ({ tasks }) => {
  return (
    <div className="glass-panel p-5">
      <h3 className="text-base font-medium mb-4 flex items-center">
        <ListChecks size={18} className="mr-2 text-focus" />
        Sprint Tasks
      </h3>
      
      {tasks.length > 0 ? (
        <ul className="space-y-2">
          {tasks.map(task => (
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
  );
};
