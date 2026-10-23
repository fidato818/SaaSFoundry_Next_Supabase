// "use client";

// import { useState } from "react";
// import {
//   UserPlus,
//   TrendingUp,
//   X,
//   Check,
//   Loader2,
//   ArrowLeft,
// } from "lucide-react";
// import { upgradeWorkspacePlan, inviteMember } from "../app/actions";
// import Link from "next/link";

// export default function WorkspaceActions({
//   workspaceId,
//   currentPlan,
//   workspaceName,
//   planTier,
//   isOwner,
// }: {
//   workspaceId: string;
//   currentPlan: string;
//   workspaceName: string;
//   planTier: string;
//   isOwner: string;
// }) {
//   const [showUpgrade, setShowUpgrade] = useState(false);
//   const [showInvite, setShowInvite] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleUpgrade = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     try {
//       await upgradeWorkspacePlan(new FormData(e.currentTarget));
//       setShowUpgrade(false);
//     } catch (err: any) {
//       setError(err.message || "Upgrade failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInvite = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     try {
//       await inviteMember(new FormData(e.currentTarget));
//       setShowInvite(false);
//     } catch (err: any) {
//       setError(err.message || "Invite failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <header className="bg-white border-b border-gray-200">
// <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
//   <div className="flex items-center gap-4">
//     <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
//       <ArrowLeft className="h-5 w-5" />
//     </Link>
//     <h1 className="text-xl font-semibold">{workspaceName}</h1>
//     <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded capitalize">
//       {planTier}
//     </span>
//   </div>

//   <div className="flex items-center gap-2">
//     <button
//       onClick={() => setShowInvite(true)}
//       className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
//     >
//       <UserPlus className="h-4 w-4" /> Invite Member
//     </button>
//     <button
//       onClick={() => setShowUpgrade(true)}
//       className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition"
//     >
//       <TrendingUp className="h-4 w-4" /> Upgrade Plan
//     </button>
//   </div>

//         {/* Upgrade Modal */}
//         {showUpgrade && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//             <form
//               onSubmit={handleUpgrade}
//               className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
//             >
//               <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
//                 <h2 className="text-2xl font-bold">Upgrade Plan</h2>
//                 <button
//                   type="button"
//                   onClick={() => setShowUpgrade(false)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <X className="h-6 w-6" />
//                 </button>
//               </div>
//               <div className="p-6">
//                 {error && (
//                   <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
//                     {error}
//                   </div>
//                 )}
//                 <input type="hidden" name="workspaceId" value={workspaceId} />
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   {[
//                     {
//                       name: "Starter",
//                       price: "Free",
//                       tasks: "50 tasks",
//                       members: "5 members",
//                       key: "starter" as const,
//                     },
//                     {
//                       name: "Pro",
//                       price: "$20/mo",
//                       tasks: "500 tasks",
//                       members: "50 members",
//                       key: "pro" as const,
//                     },
//                     {
//                       name: "Enterprise",
//                       price: "$100/mo",
//                       tasks: "Unlimited",
//                       members: "Unlimited",
//                       key: "enterprise" as const,
//                     },
//                   ].map((plan) => (
//                     <div
//                       key={plan.name}
//                       className={`border-2 rounded-xl p-6 ${currentPlan === plan.key ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
//                     >
//                       <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
//                       <p className="text-3xl font-bold mb-4">{plan.price}</p>
//                       <ul className="space-y-2 mb-6">
//                         <li className="flex items-center gap-2">
//                           <Check className="h-4 w-4 text-green-500" />
//                           <span className="text-sm">{plan.tasks}</span>
//                         </li>
//                         <li className="flex items-center gap-2">
//                           <Check className="h-4 w-4 text-green-500" />
//                           <span className="text-sm">{plan.members}</span>
//                         </li>
//                       </ul>
//                       <button
//                         type="submit"
//                         name="newPlan"
//                         value={plan.key}
//                         disabled={loading || currentPlan === plan.key}
//                         className="w-full py-2 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
//                       >
//                         {loading ? (
//                           <Loader2 className="h-5 w-5 animate-spin mx-auto" />
//                         ) : currentPlan === plan.key ? (
//                           "Current Plan"
//                         ) : (
//                           "Upgrade"
//                         )}
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </form>
//           </div>
//         )}

//         {/* Invite Modal */}
//         {showInvite && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//             <form
//               onSubmit={handleInvite}
//               className="bg-white rounded-xl max-w-md w-full"
//             >
//               <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
//                 <h2 className="text-xl font-bold flex items-center gap-2">
//                   <UserPlus className="h-5 w-5" /> Invite Member
//                 </h2>
//                 <button
//                   type="button"
//                   onClick={() => setShowInvite(false)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <X className="h-6 w-6" />
//                 </button>
//               </div>
//               <div className="p-6 space-y-4">
//                 {error && (
//                   <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
//                     {error}
//                   </div>
//                 )}
//                 <input type="hidden" name="workspaceId" value={workspaceId} />
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Email Address
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                     placeholder="member@example.com"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Role
//                   </label>
//                   <select
//                     name="role"
//                     defaultValue="member"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                   >
//                     <option value="member">Member</option>
//                     <option value="owner">Owner</option>
//                   </select>
//                 </div>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
//                 >
//                   {loading ? (
//                     <>
//                       <Loader2 className="h-5 w-5 animate-spin" /> Inviting...
//                     </>
//                   ) : (
//                     "Send Invitation"
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// }

"use client";

import { useState } from "react";
import {
  UserPlus,
  TrendingUp,
  X,
  Check,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { upgradeWorkspacePlan, inviteMember } from "../app/actions";
import Link from "next/link";
export default function WorkspaceActions({
  workspaceId,
  currentPlan,
  workspaceName,
  planTier,
  isOwner,
}: {
  workspaceId: string;
  currentPlan: string;
  workspaceName: string;
  planTier: string;
  isOwner: string;
}) {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ EXPLICIT VALUES — koi form DOM nahi, koi FormData auto-read nahi
  const handleUpgrade = async (planKey: "starter" | "pro" | "enterprise") => {
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("workspaceId", workspaceId);
      formData.append("newPlan", planKey);

      console.log("📤 Sending upgrade:", { workspaceId, planKey }); // debug

      await upgradeWorkspacePlan(formData);
      setShowUpgrade(false);
    } catch (err: any) {
      setError(err.message || "Upgrade failed");
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = new FormData(e.currentTarget);
      const formData = new FormData();
      formData.append("workspaceId", workspaceId);
      formData.append("email", data.get("email") as string);
      formData.append("role", (data.get("role") as string) || "member");

      await inviteMember(formData);
      setShowInvite(false);
    } catch (err: any) {
      setError(err.message || "Invite failed");
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      name: "Starter",
      price: "Free",
      tasks: "50 tasks",
      members: "5 members",
      key: "starter" as const,
    },
    {
      name: "Pro",
      price: "$20/mo",
      tasks: "500 tasks",
      members: "50 members",
      key: "pro" as const,
    },
    {
      name: "Enterprise",
      price: "$100/mo",
      tasks: "Unlimited",
      members: "Unlimited",
      key: "enterprise" as const,
    },
  ];

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

        {/* <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
          >
            <UserPlus className="h-4 w-4" /> Invite Member
          </button>
          <button
            onClick={() => setShowUpgrade(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition"
          >
            <TrendingUp className="h-4 w-4" /> Upgrade Plan
          </button>
        </div> */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setError("");
              setShowInvite(true);
            }}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
          >
            <UserPlus className="h-4 w-4" /> Invite Member
          </button>

          <button
            type="button"
            onClick={() => {
              setError("");
              setShowUpgrade(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition"
          >
            <TrendingUp className="h-4 w-4" /> Upgrade Plan
          </button>
        </div>

        {/* ================= UPGRADE MODAL ================= */}
        {showUpgrade && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Upgrade Plan</h2>
                <button
                  type="button"
                  onClick={() => setShowUpgrade(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <p className="text-sm text-gray-500 mb-4">
                  Current plan:{" "}
                  <strong className="capitalize">{currentPlan}</strong>
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {plans.map((plan) => (
                    <div
                      key={plan.key}
                      className={`border-2 rounded-xl p-6 ${
                        currentPlan === plan.key
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
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

                      {/* ✅ type="button" + onClick (submit/FormData nahi) */}
                      <button
                        type="button"
                        onClick={() => handleUpgrade(plan.key)}
                        disabled={loading || currentPlan === plan.key}
                        className="w-full py-2 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 flex items-center justify-center"
                      >
                        {loading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : currentPlan === plan.key ? (
                          "Current Plan"
                        ) : (
                          "Upgrade"
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= INVITE MODAL ================= */}
        {showInvite && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <form
              onSubmit={handleInvite}
              className="bg-white rounded-xl max-w-md w-full"
            >
              <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <UserPlus className="h-5 w-5" /> Invite Member
                </h2>
                <button
                  type="button"
                  onClick={() => setShowInvite(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="member@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    name="role"
                    defaultValue="member"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="member">Member</option>
                    <option value="owner">Owner</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> Inviting...
                    </>
                  ) : (
                    "Send Invitation"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
