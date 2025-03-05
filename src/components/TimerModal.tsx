
import React, { useEffect } from 'react';
import { formatTime, formatTimeHuman } from '@/utils/timeUtils';
import { Task } from '@/types';
import { Clock, Square } from 'lucide-react';
import { useWorkspace } from '@/context/WorkspaceContext';

interface TimerModalProps {
  task: Task;
  onClose: () => void;
}

export const TimerModal: React.FC<TimerModalProps> = ({ task, onClose }) => {
  const { elapsedTime, stopTimeTracking } = useWorkspace();
  
  // Calculate total time including current session
  const totalTimeSpent = task.totalTimeSpent + elapsedTime;
  const progressPercentage = Math.min(100, Math.floor((totalTimeSpent / task.estimatedTime) * 100));
  
  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  const handleStopTimer = () => {
    stopTimeTracking(task.id);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="max-w-md w-full bg-card p-8 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-1">{task.title}</h2>
          <p className="text-muted-foreground">{task.description || 'No description'}</p>
        </div>
        
        <div className="bg-accent p-6 rounded-lg mb-8 text-center">
          <div className="text-5xl font-mono font-bold mb-2">
            {formatTime(elapsedTime)}
          </div>
          <div className="text-sm text-muted-foreground">
            Session time
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Total time spent</span>
            <span className="font-medium">
              {formatTimeHuman(totalTimeSpent)} / {formatTimeHuman(task.estimatedTime)}
            </span>
          </div>
          
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
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
        </div>
        
        <div className="text-center">
          <button 
            onClick={handleStopTimer}
            className="bg-destructive text-destructive-foreground font-medium px-6 py-3 rounded-md transition-all hover:bg-destructive/90 active:scale-[0.98] flex items-center mx-auto"
          >
            <Square size={18} className="mr-2" />
            Stop Timer
          </button>
          <p className="text-xs text-muted-foreground mt-4">
            Your time will be recorded when you stop the timer
          </p>
        </div>
      </div>
    </div>
  );
};
