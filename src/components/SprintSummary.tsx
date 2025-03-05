
import React from 'react';
import { Sprint } from '@/types';
import { formatDateReadable, formatTimeHuman } from '@/utils/timeUtils';
import { CalendarRange, Clock, CheckCircle2 } from 'lucide-react';

interface SprintSummaryProps {
  sprint: Sprint;
}

export const SprintSummary: React.FC<SprintSummaryProps> = ({ sprint }) => {
  // Calculate sprint stats
  const totalTasks = sprint.tasks.length;
  const completedTasks = sprint.tasks.filter(task => task.status === 'done').length;
  const progressTasks = sprint.tasks.filter(task => task.status === 'progress').length;
  const remainingTasks = sprint.tasks.filter(task => task.status === 'todo').length;
  
  const totalTimeSpent = sprint.tasks.reduce((total, task) => total + task.totalTimeSpent, 0);
  const totalEstimatedTime = sprint.tasks.reduce((total, task) => total + task.estimatedTime, 0);
  
  // Format date range
  const dateRange = `${formatDateReadable(sprint.startDate)} - ${formatDateReadable(sprint.endDate)}`;
  
  // Calculate progress percentage for sprint
  const progressPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;
  
  // Calculate days remaining
  const today = new Date();
  const endDate = new Date(sprint.endDate);
  const remainingDays = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  const sprintDuration = 7; // Sprint is 7 days
  const elapsedDays = Math.min(sprintDuration, sprintDuration - remainingDays);
  
  return (
    <div className="glass-panel p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium">{sprint.name}</h3>
        <div className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
          {sprint.isActive ? 'Active' : 'Completed'}
        </div>
      </div>
      
      <div className="flex items-center text-sm text-muted-foreground mb-4">
        <CalendarRange size={16} className="mr-1.5" />
        <span>{dateRange}</span>
      </div>
      
      <div className="flex justify-between mb-4">
        <div className="text-center flex-1">
          <div className="text-xs text-muted-foreground mb-1">Total</div>
          <div className="text-xl font-medium">{totalTasks}</div>
        </div>
        <div className="text-center flex-1">
          <div className="text-xs text-muted-foreground mb-1">Completed</div>
          <div className="text-xl font-medium text-emerald-600">{completedTasks}</div>
        </div>
        <div className="text-center flex-1">
          <div className="text-xs text-muted-foreground mb-1">In Progress</div>
          <div className="text-xl font-medium text-amber-600">{progressTasks}</div>
        </div>
        <div className="text-center flex-1">
          <div className="text-xs text-muted-foreground mb-1">To Do</div>
          <div className="text-xl font-medium text-slate-600">{remainingTasks}</div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <div className="text-sm font-medium">Sprint Progress</div>
          <div className="text-sm">{progressPercentage}%</div>
        </div>
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-focus rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <div className="text-sm font-medium">Days</div>
          <div className="text-sm">{elapsedDays} of {sprintDuration}</div>
        </div>
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent-foreground rounded-full transition-all duration-500"
            style={{ width: `${(elapsedDays / sprintDuration) * 100}%` }}
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center p-3 bg-secondary rounded-md mt-4">
        <div className="flex items-center">
          <Clock size={16} className="mr-1.5 text-focus" />
          <span className="text-sm">Time Logged</span>
        </div>
        <div className="text-sm font-medium">
          {formatTimeHuman(totalTimeSpent)} / {formatTimeHuman(totalEstimatedTime)}
        </div>
      </div>
    </div>
  );
};
