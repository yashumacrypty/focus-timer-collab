
import React, { useEffect, useState } from 'react';
import { Task } from '@/types';
import { formatTime, formatTimeHuman } from '@/utils/timeUtils';
import { Clock, Play, Square } from 'lucide-react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { TimerModal } from './TimerModal';

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
  const [showTimerModal, setShowTimerModal] = useState(false);
  
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
      setShowTimerModal(true);
    }
  };
  
  const handleStopTracking = () => {
    if (currentlyTracking) {
      stopTimeTracking(currentlyTracking);
      setShowTimerModal(false);
    }
  };
  
  return (
    <div className="glass-panel p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-medium flex items-center">
          <Clock size={20} className="mr-2 text-focus" />
          Time Tracker
        </h3>
      </div>
      
      {showTaskSelector && !currentlyTracking && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select a task to track</label>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="select-focus w-full p-3"
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
        <div className="mb-6 p-4 bg-accent rounded-md">
          <p className="text-base font-medium">{currentTask.title}</p>
          <div className="text-sm text-muted-foreground mt-2 flex justify-between">
            <span>
              {formatTimeHuman(currentTask.totalTimeSpent + elapsedTime)} / {formatTimeHuman(currentTask.estimatedTime)}
            </span>
            <span>
              {Math.min(100, Math.floor(((currentTask.totalTimeSpent + elapsedTime) / currentTask.estimatedTime) * 100))}%
            </span>
          </div>
          
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mt-2">
            <div 
              className="h-full bg-focus rounded-full"
              style={{ 
                width: `${Math.min(100, Math.floor(((currentTask.totalTimeSpent + elapsedTime) / currentTask.estimatedTime) * 100))}%` 
              }}
            />
          </div>
        </div>
      )}
      
      <div className="bg-secondary p-6 rounded-md flex flex-col items-center justify-center">
        <div className="text-4xl font-mono font-medium mb-5">
          {formatTime(currentlyTracking ? elapsedTime : 0)}
        </div>
        
        <div className="flex space-x-3">
          {!currentlyTracking ? (
            <button 
              onClick={handleStartTracking}
              disabled={!selectedTaskId}
              className="btn-focus flex items-center px-6 py-3 text-base"
            >
              <Play size={18} className="mr-2" />
              Start Tracking
            </button>
          ) : (
            <button 
              onClick={handleStopTracking}
              className="bg-destructive text-destructive-foreground font-medium px-6 py-3 rounded-md transition-all hover:bg-destructive/90 active:scale-[0.98] flex items-center text-base"
            >
              <Square size={18} className="mr-2" />
              Stop
            </button>
          )}
        </div>
      </div>
      
      {currentlyTracking && currentTask && showTimerModal && (
        <TimerModal 
          task={currentTask} 
          onClose={() => {
            stopTimeTracking(currentTask.id);
            setShowTimerModal(false);
          }} 
        />
      )}
    </div>
  );
};
