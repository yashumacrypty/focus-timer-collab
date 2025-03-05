import React, { useEffect, useState } from 'react';
import { Task } from '@/types';
import { formatTime, formatTimeHuman } from '@/utils/timeUtils';
import { Clock, Play, Square } from 'lucide-react';
import { useWorkspace } from '@/context/WorkspaceContext';

interface TimeTrackerProps {
  showTaskSelector?: boolean;
}

export const TimeTracker: React.FC<TimeTrackerProps> = ({ showTaskSelector = true }) => {
  const { 
    tasks, 
    currentlyTracking, 
    elapsedTime, 
    startTimeTracking, 
    stopTimeTracking 
  } = useWorkspace();
  
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  
  // Auto-select the first non-completed task if available
  useEffect(() => {
    if (!selectedTaskId && tasks.length > 0 && !currentlyTracking) {
      const nonCompletedTasks = tasks.filter(task => task.status !== 'done');
      if (nonCompletedTasks.length > 0) {
        setSelectedTaskId(nonCompletedTasks[0].id);
      }
    }
  }, [tasks, selectedTaskId, currentlyTracking]);
  
  // Keep the selected task in sync with the currently tracked task
  useEffect(() => {
    if (currentlyTracking) {
      setSelectedTaskId(currentlyTracking);
    }
  }, [currentlyTracking]);
  
  const currentTask = tasks.find(task => task.id === currentlyTracking);
  
  const handleStartTracking = () => {
    if (selectedTaskId) {
      startTimeTracking(selectedTaskId);
    }
  };
  
  const handleStopTracking = () => {
    if (currentlyTracking) {
      stopTimeTracking(currentlyTracking);
    }
  };
  
  return (
    <div className="glass-panel p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium flex items-center">
          <Clock size={18} className="mr-2 text-focus" />
          Time Tracker
        </h3>
      </div>
      
      {showTaskSelector && !currentlyTracking && (
        <div className="mb-4">
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="select-focus"
            disabled={!!currentlyTracking}
          >
            <option value="">-- Select a task --</option>
            {tasks
              .filter(task => task.status !== 'done')
              .map(task => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))
            }
          </select>
        </div>
      )}
      
      {currentlyTracking && currentTask && (
        <div className="mb-4 p-3 bg-accent rounded-md">
          <p className="text-sm font-medium">{currentTask.title}</p>
          <div className="text-xs text-muted-foreground mt-1 flex justify-between">
            <span>
              {formatTimeHuman(currentTask.totalTimeSpent)} / {formatTimeHuman(currentTask.estimatedTime)}
            </span>
            <span>
              {Math.min(100, Math.floor((currentTask.totalTimeSpent / currentTask.estimatedTime) * 100))}%
            </span>
          </div>
        </div>
      )}
      
      <div className="bg-secondary p-4 rounded-md flex flex-col items-center justify-center">
        <div className="text-3xl font-mono font-medium mb-4">
          {formatTime(currentlyTracking ? elapsedTime : 0)}
        </div>
        
        <div className="flex space-x-3">
          {!currentlyTracking ? (
            <button 
              onClick={handleStartTracking}
              disabled={!selectedTaskId}
              className="btn-focus flex items-center"
            >
              <Play size={16} className="mr-2" />
              Start Tracking
            </button>
          ) : (
            <button 
              onClick={handleStopTracking}
              className="bg-destructive text-destructive-foreground font-medium px-4 py-2 rounded-md transition-all hover:bg-destructive/90 active:scale-[0.98] flex items-center"
            >
              <Square size={16} className="mr-2" />
              Stop
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
