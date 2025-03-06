
import React from 'react';
import { SprintSummary } from '@/components/SprintSummary';
import { Sprint, Task } from '@/types';
import { CalendarDays } from 'lucide-react';

interface CurrentSprintOverviewProps {
  sprint: Sprint;
  sprintTasks: Task[];
}

export const CurrentSprintOverview: React.FC<CurrentSprintOverviewProps> = ({
  sprint,
  sprintTasks
}) => {
  const completedTasks = sprintTasks.filter(task => task.status === 'done');
  const progressPercentage = sprintTasks.length > 0 
    ? Math.floor((completedTasks.length / sprintTasks.length) * 100) 
    : 0;
    
  return (
    <div className="glass-panel p-5">
      <h3 className="text-base font-medium mb-4 flex items-center">
        <CalendarDays size={18} className="mr-2 text-focus" />
        Current Sprint
      </h3>
      
      <SprintSummary sprint={sprint} />
      
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
  );
};
