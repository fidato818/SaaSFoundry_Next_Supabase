import {
  getWorkspaceTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
  getWorkspaceMembers,
  getWorkspaceTaskCount,
  getWorkspaceMemberCount,
} from "../../../app/actions";
import { redirect } from "next/navigation";
import InviteMemberModal from "../../../components/InviteMemberModal";
import TaskStatusSelect from "../../../components/TaskStatusSelect";
import WorkspaceHeader from "../../../components/WorkspaceHeader";
import WorkspaceActions from "../../../components/WorkspaceActions";
import MemberList from "../../../components/MemberList";
import WorkspaceDangerZone from "../../../components/WorkspaceDangerZone";
import {
  Plus,
  Trash2,
  ArrowLeft,
  Users,
  ListTodo,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../utils/supabase/server";
// import PlanUpgradeModal from "@/src/components/PlanUpgradeModal";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Workspace fetch karein pehle
  const { data: workspace, error: wsError } = await supabase
    .from("workspaces")
    .select("name, plan_tier, task_limit, member_limit, owner_id")
    .eq("id", id)
    .single();

  if (wsError || !workspace) {
    console.error("Workspace fetch error:", wsError);
    redirect("/dashboard");
  }

  // Baaki data fetch karein with error handling
  let tasks: any[] = [];
  let members: any[] = [];
  let taskCount = 0;
  let memberCount = 0;

  try {
    [tasks, members, taskCount, memberCount] = await Promise.all([
      getWorkspaceTasks(id)?.catch((err) => {
        console.error("Tasks fetch error:", err);
        return [];
      }),
      getWorkspaceMembers(id).catch((err) => {
        console.error("Members fetch error:", err);
        return [];
      }),
      getWorkspaceTaskCount(id).catch((err) => {
        console.error("Task count error:", err);
        return 0;
      }),
      getWorkspaceMemberCount(id).catch((err) => {
        console.error("Member count error:", err);
        return 0;
      }),
    ]);
  } catch (error) {
    console.error("Data fetch error:", error);
  }

  const isOwner = workspace.owner_id === user.id;
  const taskUsagePercent =
    workspace.task_limit > 0 ? (taskCount / workspace.task_limit) * 100 : 0;
  const memberUsagePercent =
    workspace.member_limit > 0
      ? (memberCount / workspace.member_limit) * 100
      : 0;

  const createTaskWithId = createTask.bind(null, id);
  // const deleteTaskWithId = (taskId: string) => {
  //   deleteTask(taskId, id);
  // };

  const statusColors = {
    todo: "bg-gray-100 text-gray-700",
    in_progress: "bg-yellow-100 text-yellow-700",
    done: "bg-green-100 text-green-700",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <WorkspaceHeader
        workspaceName={workspace.name}
        planTier={workspace.plan_tier}
        isOwner={isOwner}
      /> */}
      {isOwner && (
        <WorkspaceActions
          workspaceName={workspace.name}
          planTier={workspace.plan_tier}
          isOwner={isOwner}
          workspaceId={id}
          currentPlan={workspace.plan_tier}
        />
      )}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN: Tasks (Takes 2/3 width on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Plan Usage Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-gray-700">
                    Tasks
                  </span>
                  <span className="text-xs text-gray-500">
                    {taskCount} /{" "}
                    {workspace.task_limit === 999999
                      ? "∞"
                      : workspace.task_limit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${taskUsagePercent > 90 ? "bg-red-500" : taskUsagePercent > 70 ? "bg-yellow-500" : "bg-green-500"}`}
                    style={{ width: `${Math.min(taskUsagePercent, 100)}%` }}
                  />
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-gray-700">
                    Members
                  </span>
                  <span className="text-xs text-gray-500">
                    {memberCount} /{" "}
                    {workspace.member_limit === 999999
                      ? "∞"
                      : workspace.member_limit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${memberUsagePercent > 90 ? "bg-red-500" : memberUsagePercent > 70 ? "bg-yellow-500" : "bg-green-500"}`}
                    style={{ width: `${Math.min(memberUsagePercent, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Create Task Form */}
            <form
              action={createTaskWithId}
              className="bg-white p-4 rounded-xl border border-gray-200"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  name="title"
                  required
                  minLength={1}
                  maxLength={120}
                  placeholder="New task title..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
                <select
                  name="assigneeId"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                >
                  <option value="">Unassigned</option>
                  {members.map((m: any) => (
                    <option key={m.user_id} value={m.user_id}>
                      {m.profiles?.display_name || m.profiles?.email || "User"}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  Add
                </button>
              </div>
            </form>

            {/* Tasks List */}
            {tasks.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200 border-dashed">
                <p className="text-gray-500">
                  There are no tasks. Please add a new one.{" "}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.map((task: any) => {
                  const assignee = members.find(
                    (m: any) => m.user_id === task.assignee_id,
                  );
                  const assigneeName =
                    assignee?.profiles?.display_name ||
                    assignee?.profiles?.email ||
                    "Unassigned";
                  return (
                    <div
                      key={task.id}
                      className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between group hover:border-blue-300 transition"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <TaskStatusSelect
                          taskId={task.id}
                          workspaceId={id}
                          currentStatus={task.status}
                        />
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">
                            {task.title}
                          </span>
                          {task.assignee_id && (
                            <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                              → {assigneeName}
                            </span>
                          )}
                        </div>
                      </div>
                      <form action={deleteTask}>
                        <input type="hidden" name="taskId" value={task.id} />
                        <input type="hidden" name="workspaceId" value={id} />
                        <button
                          type="submit"
                          className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Sidebar (Members & Settings) */}
          <div className="space-y-6">
            {isOwner && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                  Settings
                </h3>
                {/* <WorkspaceActions
                  workspaceId={id}
                  currentPlan={workspace.plan_tier}
                /> */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <WorkspaceDangerZone
                    workspaceId={id}
                    workspaceName={workspace.name}
                  />
                </div>
              </div>
            )}

            <MemberList members={members} isOwner={isOwner} workspaceId={id} />
          </div>
        </div>
      </main>
    </div>
  );
}

// <main className="max-w-7xl mx-auto px-4 py-8">
//   {/* Plan Usage Stats */}
//   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//     <div className="bg-white p-4 rounded-xl border border-gray-200">
//       <div className="flex items-center justify-between mb-2">
//         <div className="flex items-center gap-2">
//           <ListTodo className="h-5 w-5 text-blue-600" />
//           <span className="font-semibold">Tasks</span>
//         </div>
//         <span className="text-sm text-gray-600">
//           {taskCount} /{" "}
//           {workspace.task_limit === 999999 ? "∞" : workspace.task_limit}
//         </span>
//       </div>
//       <div className="w-full bg-gray-200 rounded-full h-2">
//         <div
//           className={`h-2 rounded-full transition-all ${
//             taskUsagePercent > 90
//               ? "bg-red-500"
//               : taskUsagePercent > 70
//                 ? "bg-yellow-500"
//                 : "bg-green-500"
//           }`}
//           style={{ width: `${Math.min(taskUsagePercent, 100)}%` }}
//         />
//       </div>
//     </div>

//     <div className="bg-white p-4 rounded-xl border border-gray-200">
//       <div className="flex items-center justify-between mb-2">
//         <div className="flex items-center gap-2">
//           <Users className="h-5 w-5 text-purple-600" />
//           <span className="font-semibold">Members</span>
//         </div>
//         <span className="text-sm text-gray-600">
//           {memberCount} /{" "}
//           {workspace.member_limit === 999999
//             ? "∞"
//             : workspace.member_limit}
//         </span>
//       </div>
//       <div className="w-full bg-gray-200 rounded-full h-2">
//         <div
//           className={`h-2 rounded-full transition-all ${
//             memberUsagePercent > 90
//               ? "bg-red-500"
//               : memberUsagePercent > 70
//                 ? "bg-yellow-500"
//                 : "bg-green-500"
//           }`}
//           style={{ width: `${Math.min(memberUsagePercent, 100)}%` }}
//         />
//       </div>
//     </div>
//   </div>

//   {/* Create Task Form */}
//   <form
//     action={createTaskWithId}
//     className="bg-white p-4 rounded-xl border border-gray-200 mb-6"
//   >
//     <div className="flex gap-2">
//       <input
//         type="text"
//         name="title"
//         required
//         minLength={1}
//         maxLength={120}
//         placeholder="New task title..."
//         className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//       />
//       <select
//         name="assigneeId"
//         className="px-4 py-2 border border-gray-300 rounded-lg"
//       >
//         <option value="">Unassigned</option>
//         {members.map((m: any) => (
//           <option key={m.user_id} value={m.user_id}>
//             {m.profiles?.display_name || m.profiles?.email || "User"}
//           </option>
//         ))}
//       </select>
//       <button
//         type="submit"
//         className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
//       >
//         <Plus className="h-4 w-4" />
//         Add
//       </button>
//     </div>
//   </form>

//   {/* Tasks List */}
//   {/* Tasks List */}
//   {/* Tasks List */}
//   {/* Tasks List */}
//   {tasks.length === 0 ? (
//     <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
//       <p className="text-gray-500">
//         Koi task nahi hai. Upar se naya add karein!
//       </p>
//     </div>
//   ) : (
//     <div className="space-y-2">
//       {tasks.map((task: any) => {
//         const assignee = members.find(
//           (m: any) => m.user_id === task.assignee_id,
//         );
//         const assigneeName =
//           assignee?.profiles?.display_name ||
//           assignee?.profiles?.email ||
//           "Unassigned";

//         return (
//           <div
//             key={task.id}
//             className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between"
//           >
//             <div className="flex items-center gap-3 flex-1">
//               <TaskStatusSelect
//                 taskId={task.id}
//                 workspaceId={id}
//                 currentStatus={task.status}
//               />
//               <div className="flex-1">
//                 <span className="font-medium">{task.title}</span>
//                 {task.assignee_id && (
//                   <span className="ml-2 text-sm text-gray-500">
//                     → {assigneeName}
//                   </span>
//                 )}
//               </div>
//             </div>

//             {/* ✅ Hidden input fields use karein */}
//             <form action={deleteTask}>
//               <input type="hidden" name="taskId" value={task.id} />
//               <input type="hidden" name="workspaceId" value={id} />
//               <button
//                 type="submit"
//                 className="text-red-500 hover:text-red-700 p-2"
//               >
//                 <Trash2 className="h-4 w-4" />
//               </button>
//             </form>
//           </div>
//         );
//       })}
//     </div>
//   )}
//   {/* <dialog id="invite-modal" className="modal">
//     <InviteMemberModal
//       workspaceId={id}
//       onClose={() => document.getElementById("invite-modal")?.close()}
//     />
//   </dialog> */}

//   {/* Upgrade Modal */}
//   {/* <dialog id="upgrade-modal" className="modal">
//     <PlanUpgradeModal
//       workspaceId={id}
//       currentPlan={workspace.plan_tier}
//       onClose={() => document.getElementById("upgrade-modal")?.close()}
//     />
//   </dialog> */}
// </main>
