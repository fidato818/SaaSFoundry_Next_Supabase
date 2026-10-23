'use client';

import { useState } from 'react';
import { updateTaskStatus } from '../app/actions';
import { Loader2 } from 'lucide-react';

interface TaskStatusSelectProps {
  taskId: string;
  workspaceId: string;
  currentStatus: string;
}

export default function TaskStatusSelect({ taskId, workspaceId, currentStatus }: TaskStatusSelectProps) {
  const [loading, setLoading] = useState(false);

  const statusColors = {
    todo: 'bg-gray-100 text-gray-700',
    in_progress: 'bg-yellow-100 text-yellow-700',
    done: 'bg-green-100 text-green-700',
  };

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as 'todo' | 'in_progress' | 'done';
    setLoading(true);
    
    try {
      await updateTaskStatus(taskId, workspaceId, newStatus);
    } catch (error) {
      console.error('Status update error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <select
        defaultValue={currentStatus}
        onChange={handleChange}
        disabled={loading}
        className={`text-sm px-3 py-1 rounded font-medium cursor-pointer ${
          statusColors[currentStatus as keyof typeof statusColors]
        } disabled:opacity-50`}
      >
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      {loading && (
        <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
      )}
    </div>
  );
}