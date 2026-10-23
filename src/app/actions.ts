"use server";

import { createClient } from "../utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ============================================
// WORKSPACE ACTIONS
// ============================================

// User ke saare workspaces fetch karna
export async function getUserWorkspaces() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("workspace_members")
    .select(
      `
      role,
      workspaces (
        id,
        name,
        owner_id,
        created_at
      )
    `,
    )
    .eq("user_id", user.id);

  if (error) throw error;

  // Data ko clean format mein return karein
  return data.map((m) => ({
    ...m.workspaces,
    userRole: m.role,
  }));
}

// Naya workspace create karna
export async function createWorkspace(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;

  if (!name || name.length < 1 || name.length > 80) {
    throw new Error("Workspace name must be 1-80 characters");
  }

  // Transaction use karein taake dono inserts ek sath hon
  const { data: workspace, error: wsError } = await supabase
    .from("workspaces")
    .insert({
      name,
      owner_id: user.id,
    })
    .select()
    .single();

  if (wsError) {
    console.error("Workspace insert error:", wsError);
    throw wsError;
  }

  // Thoda delay taake RLS policies properly evaluate hon
  await new Promise((resolve) => setTimeout(resolve, 100));

  const { error: memberError } = await supabase
    .from("workspace_members")
    .insert({
      workspace_id: workspace.id,
      user_id: user.id,
      role: "owner",
    });

  if (memberError) {
    console.error("Member insert error:", memberError);
    // Agar member insert fail ho, toh workspace bhi delete kar do
    await supabase.from("workspaces").delete().eq("id", workspace.id);
    throw memberError;
  }

  revalidatePath("/dashboard");
  redirect(`/workspaces/${workspace.id}`);
}

// Workspace delete karna (sirf owner)
// export async function deleteWorkspace(workspaceId: string) {
//   const supabase = await createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) throw new Error("Unauthorized");

//   // Check karein ke user owner hai
//   const { data: member } = await supabase
//     .from("workspace_members")
//     .select("role")
//     .eq("workspace_id", workspaceId)
//     .eq("user_id", user.id)
//     .single();

//   if (!member || member.role !== "owner") {
//     throw new Error("Only owners can delete workspaces");
//   }

//   const { error } = await supabase
//     .from("workspaces")
//     .delete()
//     .eq("id", workspaceId);

//   if (error) throw error;

//   revalidatePath("/dashboard");
//   redirect("/dashboard");
// }

// ============================================
// TASK ACTIONS
// ============================================

// Workspace ke saare tasks fetch karna
export async function getWorkspaceTasks(workspaceId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // Simple query - sirf task fields, koi relationship join nahi
  const { data, error } = await supabase
    .from("tasks")
    .select(
      `
      id,
      workspace_id,
      title,
      assignee_id,
      status,
      created_by,
      created_at,
      updated_at
    `,
    )
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Tasks fetch error:", error);
    throw error;
  }

  return data || [];
}

// Naya task create karna
export async function createTask(workspaceId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const assigneeId = (formData.get("assigneeId") as string) || null;

  if (!title || title.length < 1 || title.length > 120) {
    throw new Error("Task title must be 1-120 characters");
  }

  // ============================================
  // TASK LIMIT CHECK
  // ============================================
  const { data: workspace } = await supabase
    .from("workspaces")
    .select("task_limit, plan_tier")
    .eq("id", workspaceId)
    .single();

  if (!workspace) throw new Error("Workspace not found");

  const currentTaskCount = await getWorkspaceTaskCount(workspaceId);

  if (currentTaskCount >= workspace.task_limit) {
    throw new Error(
      `Task limit reached! Your ${workspace.plan_tier} plan allows ${workspace.task_limit} tasks. Please upgrade your plan.`,
    );
  }

  // Check karein ke assignee workspace member hai (agar diya gaya hai)
  if (assigneeId) {
    const { data: isMember } = await supabase
      .from("workspace_members")
      .select("user_id")
      .eq("workspace_id", workspaceId)
      .eq("user_id", assigneeId)
      .single();

    if (!isMember) {
      throw new Error("Assignee must be a workspace member");
    }
  }

  const { error } = await supabase.from("tasks").insert({
    workspace_id: workspaceId,
    title,
    assignee_id: assigneeId,
    status: "todo",
    created_by: user.id,
  });

  if (error) throw error;

  revalidatePath(`/workspaces/${workspaceId}`);
}

// Task ka status update karna
export async function updateTaskStatus(
  taskId: string,
  workspaceId: string,
  newStatus: "todo" | "in_progress" | "done",
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("tasks")
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", taskId);

  if (error) {
    console.error("Status update error:", error);
    throw error;
  }

  revalidatePath(`/workspaces/${workspaceId}`);
}
// Task delete karna
export async function deleteTask(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const taskId = formData.get("taskId") as string;
  const workspaceId = formData.get("workspaceId") as string;

  if (!taskId || !workspaceId) {
    throw new Error("Missing taskId or workspaceId");
  }

  const { error } = await supabase.from("tasks").delete().eq("id", taskId);

  if (error) {
    console.error("Delete error:", error);
    throw error;
  }

  revalidatePath(`/workspaces/${workspaceId}`);
}

// ============================================
// MEMBER ACTIONS
// ============================================

// Workspace ke members fetch karna
export async function getWorkspaceMembers(workspaceId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // Step 1: Pehle workspace_members fetch karein (bina kisi join ke)
  const { data: members, error: membersError } = await supabase
    .from("workspace_members")
    .select("user_id, role, joined_at")
    .eq("workspace_id", workspaceId);

  if (membersError) {
    console.error("Members fetch error:", membersError);
    throw membersError;
  }

  if (!members || members.length === 0) {
    return [];
  }

  // Step 2: Saare user_ids collect karein
  const userIds = members.map((m) => m.user_id);

  // Step 3: Profiles table se un users ki details fetch karein
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, email, display_name")
    .in("id", userIds);

  if (profilesError) {
    console.error("Profiles fetch error:", profilesError);
    throw profilesError;
  }

  // Step 4: Dono data ko merge karein
  const result = members.map((member) => {
    const profile = profiles?.find((p) => p.id === member.user_id);
    return {
      ...member,
      profiles: profile || {
        id: member.user_id,
        email: "Unknown",
        display_name: "Unknown",
      },
    };
  });

  return result;
}

// Member invite karna (sirf owner)
export async function inviteMember(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const workspaceId = formData.get("workspaceId") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as "owner" | "member";

  if (!workspaceId || !email || !role) throw new Error("Missing data");

  const { data: currentMember } = await supabase
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .single();

  if (!currentMember || currentMember.role !== "owner") {
    throw new Error("Only owners can invite members");
  }

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("member_limit, plan_tier")
    .eq("id", workspaceId)
    .single();
  if (!workspace) throw new Error("Workspace not found");

  const currentMemberCount = await getWorkspaceMemberCount(workspaceId);
  if (currentMemberCount >= workspace.member_limit) {
    throw new Error(
      `Member limit reached! Your ${workspace.plan_tier} plan allows ${workspace.member_limit} members.`,
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();
  if (!profile)
    throw new Error(
      "User not found with this email. Please ask them to sign up first.",
    );

  const { data: existingMember } = await supabase
    .from("workspace_members")
    .select("user_id")
    .eq("workspace_id", workspaceId)
    .eq("user_id", profile.id)
    .single();
  if (existingMember)
    throw new Error("User is already a member of this workspace");

  const { error } = await supabase
    .from("workspace_members")
    .insert({ workspace_id: workspaceId, user_id: profile.id, role });
  if (error) throw error;

  revalidatePath(`/workspaces/${workspaceId}`);
}
// ============================================
// PLAN UPGRADE ACTIONS
// ============================================

// export async function upgradeWorkspacePlan(
//   workspaceId: string,
//   newPlan: "starter" | "pro" | "enterprise",
// ) {
//   const supabase = await createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) throw new Error("Unauthorized");

//   // Check karein ke user owner hai
//   const { data: workspace } = await supabase
//     .from("workspaces")
//     .select("owner_id")
//     .eq("id", workspaceId)
//     .single();

//   if (!workspace || workspace.owner_id !== user.id) {
//     throw new Error("Only owners can upgrade plans");
//   }

//   // Plan ke hisaab se limits set karein
//   const planLimits = {
//     starter: { task_limit: 50, member_limit: 5 },
//     pro: { task_limit: 500, member_limit: 50 },
//     enterprise: { task_limit: 999999, member_limit: 999999 }, // Unlimited
//   };

//   const limits = planLimits[newPlan];

//   const { error } = await supabase
//     .from("workspaces")
//     .update({
//       plan_tier: newPlan,
//       task_limit: limits.task_limit,
//       member_limit: limits.member_limit,
//     })
//     .eq("id", workspaceId);

//   if (error) throw error;

//   revalidatePath(`/workspaces/${workspaceId}`);
//   revalidatePath("/dashboard");
// }

export async function upgradeWorkspacePlan(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Unauthorized');

  const workspaceId = formData.get('workspaceId') as string;
  const newPlan = formData.get('newPlan') as 'starter' | 'pro' | 'enterprise';

  if (!workspaceId || !newPlan) throw new Error('Missing data');

  // ✅ ROBUST CHECK: workspace_members table mein role check karein
  const { data: membership } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', user.id)
    .single();

  if (!membership || membership.role !== 'owner') {
    // Debugging ke liye exact role bata dega agar phir bhi error aye
    throw new Error(`Only owners can upgrade plans. Your current role: ${membership?.role || 'none'}`);
  }

  const planLimits = {
    starter: { task_limit: 50, member_limit: 5 },
    pro: { task_limit: 500, member_limit: 50 },
    enterprise: { task_limit: 999999, member_limit: 999999 },
  };

  const limits = planLimits[newPlan];

  const { error } = await supabase
    .from('workspaces')
    .update({
      plan_tier: newPlan,
      task_limit: limits.task_limit,
      member_limit: limits.member_limit,
    })
    .eq('id', workspaceId);

  if (error) {
    console.error('Upgrade DB Error:', error);
    throw new Error('Failed to upgrade plan: ' + error.message);
  }

  revalidatePath(`/workspaces/${workspaceId}`);
  revalidatePath('/dashboard');
}

// Current task count fetch karna
export async function getWorkspaceTaskCount(workspaceId: string) {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("workspace_id", workspaceId);

  if (error) throw error;
  return count || 0;
}

// Current member count fetch karna
export async function getWorkspaceMemberCount(workspaceId: string) {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("workspace_members")
    .select("*", { count: "exact", head: true })
    .eq("workspace_id", workspaceId);

  if (error) throw error;
  return count || 0;
}

// ============================================
// MEMBER REMOVE ACTION
// ============================================
export async function removeMember(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const workspaceId = formData.get("workspaceId") as string;
  const targetUserId = formData.get("targetUserId") as string;

  const { data: currentMember } = await supabase
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .single();

  if (!currentMember || currentMember.role !== "owner") {
    throw new Error("Only owners can remove members");
  }

  if (user.id === targetUserId) {
    throw new Error(
      "Owner cannot remove themselves. Delete the workspace instead.",
    );
  }

  const { error } = await supabase
    .from("workspace_members")
    .delete()
    .eq("workspace_id", workspaceId)
    .eq("user_id", targetUserId);

  if (error) throw error;
  revalidatePath(`/workspaces/${workspaceId}`);
}

// ============================================
// WORKSPACE DELETE ACTION
// ============================================
export async function deleteWorkspace(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const workspaceId = formData.get("workspaceId") as string;
  const confirmName = formData.get("confirmName") as string;

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("name, owner_id")
    .eq("id", workspaceId)
    .single();

  if (!workspace || workspace.owner_id !== user.id) {
    throw new Error("Only owners can delete this workspace");
  }

  if (confirmName !== workspace.name) {
    throw new Error("Workspace name does not match");
  }

  const { error } = await supabase
    .from("workspaces")
    .delete()
    .eq("id", workspaceId);
  if (error) throw error;

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
