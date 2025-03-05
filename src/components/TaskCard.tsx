
import React, { useState } from 'react';
import { Task, User } from '@/types';
import { formatTimeHuman } from '@/utils/timeUtils';
import { Clock, Play, Square } from 'lucide-react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { TimerModal } from './TimerModal';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { 
    startTimeTracking, 
    stopTimeTracking, 
    currentlyTracking, 
    updateTaskStatus, 
    elapsedTime
  } = useWorkspace();
  
  const [showTimerModal, setShowTimerModal] = useState(false);
  const isTracking = currentlyTracking === task.id;
  
  const statusLabels = {
    todo: 'To Do',
    progress: 'In Progress',
    done: 'Done'
  };
  
  const statusClasses = {
    todo: 'status-badge-todo',
    progress: 'status-badge-progress',
    done: 'status-badge-done'
  };
  
  const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'progress', label: 'In Progress' },
    { value: 'done', label: 'Done' }
  ];
  
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateTaskStatus(task.id, e.target.value as 'todo' | 'progress' | 'done');
  };
  
  const handleTrackingToggle = () => {
    if (isTracking) {
      stopTimeTracking(task.id);
      setShowTimerModal(false);
    } else {
      startTimeTracking(task.id);
      setShowTimerModal(true);
    }
  };
  
  // Calculate progress percentage
  const timeSpent = isTracking ? task.totalTimeSpent + elapsedTime : task.totalTimeSpent;
  const progressPercentage = Math.min(100, Math.floor((timeSpent / task.estimatedTime) * 100));
  
  return (
    <>
      <div className="card card-hover transform transition-all duration-300 hover:shadow-glass animate-fade-in">
        <div className="flex justify-between items-start mb-3">
          <span className={`status-badge ${statusClasses[task.status]}`}>
            {statusLabels[task.status]}
          </span>
          
          <select 
            value={task.status} 
            onChange={handleStatusChange}
            className="text-xs px-1 py-0.5 rounded border-border focus:outline-none focus:ring-1 focus:ring-focus text-muted-foreground"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <h3 className="text-base font-medium mb-2 leading-tight">{task.title}</h3>
        
        {task.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {task.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock size={14} className="mr-1" />
            <span className="font-medium">
              {formatTimeHuman(timeSpent)} / {formatTimeHuman(task.estimatedTime)}
            </span>
          </div>
          
          <button 
            onClick={handleTrackingToggle}
            className={`rounded-full w-8 h-8 flex items-center justify-center transition-colors ${
              isTracking 
                ? 'bg-destructive/10 text-destructive hover:bg-destructive/20' 
                : 'bg-focus/10 text-focus hover:bg-focus/20'
            }`}
          >
            {isTracking ? <Square size={16} /> : <Play size={16} />}
          </button>
        </div>
        
        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              progressPercentage >= 100 
                ? 'bg-destructive' 
                : progressPercentage >= 75 
                  ? 'bg-amber-500' 
                  : 'bg-focus'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
          {task.doerId ? (
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-focus/10 text-focus flex items-center justify-center">
                <span className="text-xs font-medium">
                  {task.doer?.name.charAt(0) || 'U'}
                </span>
              </div>
              <span className="text-xs ml-1.5 text-muted-foreground">
                {task.doer?.name || 'Assigned'}
              </span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">Unassigned</span>
          )}
          
          <div className="text-xs text-muted-foreground">
            {new Date(task.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </div>
      
      {isTracking && showTimerModal && (
        <TimerModal 
          task={task} 
          onClose={() => {
            stopTimeTracking(task.id);
            setShowTimerModal(false);
          }} 
        />
      )}
    </>
  );
};
