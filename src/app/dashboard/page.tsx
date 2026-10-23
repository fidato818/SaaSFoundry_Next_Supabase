import { getUserWorkspaces, createWorkspace } from "../../app/actions";
import { redirect } from "next/navigation";
import { Building2, Plus, LogOut, Layers } from "lucide-react";
import Link from "next/link";
import { createClient } from "../../utils/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const workspaces = await getUserWorkspaces();

  const handleLogout = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-8 h-16">
            {/* Zone 1: Single text element wordmark */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                // onClick={() => onSelectTab("overview")}
                className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-semibold">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
                  SaaSFoundry
                </span>
              </button>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link
                href="/workspaces/new"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                {/* <LogOut className="h-4 w-4" /> */}
                New Workspace
              </Link>
              <button
              // onClick={() => onSelectTab("billing")}
              // className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              //   activeTab === "billing"
              //     ? "border-slate-900 text-slate-900 font-semibold"
              //     : "border-transparent"
              // }`}
              >
                {user.email}
              </button>
              {/* <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                <LogOut className="h-4 w-4" />
                Logout
              </button> */}
              <form action={handleLogout}>
                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </form>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Workspaces</h2>
          {/* <Link
            href="/workspaces/new"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            <Plus className="h-4 w-4" />
            New Workspace
          </Link> */}
        </div>

        {workspaces.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              There is no workspace yet. Create a new one!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workspaces.map((ws) => {
              // console.log(ws);
              return (
                <Link
                  key={ws.id}
                  href={`/workspaces/${ws.id}`}
                  className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{ws.name}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        ws.userRole === "owner"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {ws.userRole}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(ws.created_at).toLocaleDateString()}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </main>
      <footer className="fixed bottom-0 left-0 z-20 w-full bg-gray-800 text-white p-4 bottom-0 border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">SaaSFoundry</span>
            <span aria-hidden="true">·</span>
            <span>Multi-Tenant Architecture</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">API Contract v1</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Isolated Workspaces</span>
            <span>RBAC Verification</span>
            <span>Quota Enforcement</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
