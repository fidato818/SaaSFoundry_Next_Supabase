"use client";

import { useState } from "react";
import { removeMember } from "../app/actions";
import { UserMinus, Loader2, Shield } from "lucide-react";

export default function MemberList({
  members,
  isOwner,
  workspaceId,
}: {
  members: any[];
  isOwner: boolean;
  workspaceId: string;
}) {
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemove = async (targetUserId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    setRemovingId(targetUserId);
    try {
      const formData = new FormData();
      formData.append("workspaceId", workspaceId);
      formData.append("targetUserId", targetUserId);
      await removeMember(formData);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">
        Members ({members.length})
      </h3>
      <div className="space-y-3">
        {members.map((m: any) => (
          <div
            key={m.user_id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                {m.profiles?.display_name?.[0]?.toUpperCase() ||
                  m.profiles?.email?.[0]?.toUpperCase() ||
                  "U"}
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  {m.profiles?.display_name || "Unknown"}
                </p>
                <p className="text-xs text-gray-500">{m.profiles?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 ${
                  m.role === "owner"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {m.role === "owner" && <Shield className="h-3 w-3" />}
                {m.role}
              </span>
              {isOwner && m.role !== "owner" && (
                <button
                  onClick={() => handleRemove(m.user_id)}
                  disabled={removingId === m.user_id}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition disabled:opacity-50"
                  title="Remove Member"
                >
                  {removingId === m.user_id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserMinus className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
