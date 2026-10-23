import { createWorkspace } from '../../../app/actions';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewWorkspacePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold mb-6">Create New Workspace</h1>

        <form action={createWorkspace} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Workspace Name
            </label>
            <input
              type="text"
              name="name"
              required
              minLength={1}
              maxLength={80}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., Marketing Team"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition"
          >
            Create Workspace
          </button>
        </form>
      </div>
    </div>
  );
}