"use client";

import { ArrowLeft, UserPlus, TrendingUp } from "lucide-react";
import Link from "next/link";
import WorkspaceActions from "./WorkspaceActions";

interface WorkspaceHeaderProps {
  workspaceName: string;
  planTier: string;
  isOwner: boolean;
}

export default function WorkspaceHeader({
  workspaceName,
  planTier,
  isOwner,
}: WorkspaceHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-semibold">{workspaceName}</h1>
          <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded capitalize">
            {planTier}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* ✅ Yeh naya Client Component sab handle karega */}
          {/* {isOwner && (
            <WorkspaceActions
              workspaceId={id}
              currentPlan={plan_tier}
            />
          )} */}
          {isOwner && (
            <>
              <button
                onClick={() =>
                  document.getElementById("invite-modal")?.showModal()
                }
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
              >
                <UserPlus className="h-4 w-4" />
                Invite Member
              </button>

              <button
                onClick={() =>
                  document.getElementById("upgrade-modal")?.showModal()
                }
                className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition"
              >
                <TrendingUp className="h-4 w-4" />
                Upgrade Plan
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
