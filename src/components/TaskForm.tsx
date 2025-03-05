
import React, { useState } from 'react';
import { Task, User } from '@/types';
import { useWorkspace } from '@/context/WorkspaceContext';
import { Clock, X } from 'lucide-react';
import { parseTimeToSeconds } from '@/utils/timeUtils';

interface TaskFormProps {
  onClose: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onClose }) => {
  const { workspace, currentUser, currentSprint, createTask } = useWorkspace();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [doerId, setDoerId] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return; // Basic validation
    }
    
    const hours = parseInt(estimatedHours) || 0;
    const minutes = parseInt(estimatedMinutes) || 0;
    const estimatedTime = (hours * 3600) + (minutes * 60); // Convert to seconds
    
    createTask({
      title,
      description,
      status: 'todo',
      reporterId: currentUser.id,
      doerId: doerId || undefined,
      estimatedTime: estimatedTime || 3600, // Default to 1 hour if not specified
      sprintId: currentSprint.id,
      workspaceId: workspace.id,
    });
    
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-dropdown max-w-lg w-full mx-4 animate-slide-up">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-lg font-medium">Create New Task</h2>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title <span className="text-destructive">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                className="input-focus"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
                rows={3}
                className="input-focus"
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="assignee" className="block text-sm font-medium mb-1">
                Assignee
              </label>
              <select
                id="assignee"
                value={doerId}
                onChange={(e) => setDoerId(e.target.value)}
                className="select-focus"
              >
                <option value="">-- Select Assignee --</option>
                {workspace.members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                <div className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  <span>Estimated Time</span>
                </div>
              </label>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(e.target.value)}
                    placeholder="Hours"
                    className="input-focus"
                  />
                </div>
                
                <div className="flex-1">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(e.target.value)}
                    placeholder="Minutes"
                    className="input-focus"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-5 flex justify-end space-x-3 pt-4 border-t border-border">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-focus">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
