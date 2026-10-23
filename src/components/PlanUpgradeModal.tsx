'use client';

import { useState } from 'react';
import { upgradeWorkspacePlan } from '../app/actions';
import { X, Check, Loader2 } from 'lucide-react';

interface PlanUpgradeModalProps {
  workspaceId: string;
  currentPlan: string;
  onClose: () => void;
}

export default function PlanUpgradeModal({ workspaceId, currentPlan, onClose }: PlanUpgradeModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const plans = [
    { name: 'Starter', price: 'Free', tasks: '50 tasks', members: '5 members', key: 'starter' as const },
    { name: 'Pro', price: '$20/mo', tasks: '500 tasks', members: '50 members', key: 'pro' as const },
    { name: 'Enterprise', price: '$100/mo', tasks: 'Unlimited', members: 'Unlimited', key: 'enterprise' as const },
  ];

  const handleUpgrade = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData(e.currentTarget);
      await upgradeWorkspacePlan(formData);
      onClose(); // Close modal on success
    } catch (err: any) {
      setError(err.message || 'Upgrade failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleUpgrade} className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Upgrade Your Plan</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Hidden field to pass workspaceId */}
          <input type="hidden" name="workspaceId" value={workspaceId} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => {
              const isCurrentPlan = currentPlan === plan.key;
              
              return (
                <div
                  key={plan.name}
                  className={`border-2 rounded-xl p-6 ${
                    isCurrentPlan ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-3xl font-bold mb-4">{plan.price}</p>
                  
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{plan.tasks}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{plan.members}</span>
                    </li>
                  </ul>

                  <button
                    type="submit"
                    name="newPlan"
                    value={plan.key}
                    disabled={loading || isCurrentPlan}
                    className={`w-full py-2 rounded-lg font-semibold transition ${
                      isCurrentPlan
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50'
                    }`}
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                    ) : isCurrentPlan ? (
                      'Current Plan'
                    ) : (
                      'Upgrade'
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </form>
    </div>
  );
}