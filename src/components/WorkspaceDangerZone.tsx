'use client';

import { useState } from 'react';
import { deleteWorkspace } from '../app/actions';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';

export default function WorkspaceDangerZone({ workspaceId, workspaceName }: { workspaceId: string, workspaceName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmName, setConfirmName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('workspaceId', workspaceId);
      formData.append('confirmName', confirmName);
      await deleteWorkspace(formData);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2.5 rounded-lg transition border border-red-200 font-medium text-sm"
      >
        <Trash2 className="h-4 w-4" /> Delete Workspace
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleDelete} className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center gap-3 text-red-600 mb-4">
          <AlertTriangle className="h-6 w-6" />
          <h2 className="text-xl font-bold">Delete Workspace</h2>
        </div>
        <p className="text-gray-600 mb-4 text-sm">
          This action cannot be undone. This will permanently delete the workspace <strong>"{workspaceName}"</strong> and all its tasks.
        </p>
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type <strong>{workspaceName}</strong> to confirm
          </label>
          <input 
            type="text" 
            required
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm"
            placeholder={workspaceName}
          />
        </div>
        <div className="flex gap-3 justify-end">
          <button 
            type="button" 
            onClick={() => { setIsOpen(false); setError(''); setConfirmName(''); }}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition text-sm font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading || confirmName !== workspaceName}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete Permanently'}
          </button>
        </div>
      </form>
    </div>
  );
}