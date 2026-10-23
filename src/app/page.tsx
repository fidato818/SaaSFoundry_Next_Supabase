// import { redirect } from 'next/navigation';

// export default function Home() {
//   // Jab user root (/) par aye, usko seedha login ya dashboard par bhej do
//   redirect('/login');
// }

// // import { redirect } from 'next/navigation';

// // export default function Home() {
// //   redirect('/dashboard');
// // }
import Link from "next/link";
import Image from "next/image";
import DashBoardImg from "../app/123.png";
import {
  ArrowRight,
  CheckCircle,
  LayoutDashboard,
  Shield,
  Users,
  Zap,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* --- NAVBAR --- */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                SaaSFoundry
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
              >
                Log in
              </Link>
              <Link
                href="/login"
                className="text-sm font-medium bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-white to-purple-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            v1.0 is now live
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
            Build your SaaS <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              10x Faster
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            The ultimate multi-tenant starter kit. Manage workspaces, assign
            roles, track tasks, and scale your application with built-in
            Supabase authentication and PostgreSQL.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl text-lg font-semibold transition shadow-lg shadow-blue-600/20"
            >
              Start Building for Free <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="#features"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-8 py-3.5 rounded-xl text-lg font-semibold transition"
            >
              View Features
            </Link>
          </div>

          {/* Mock Dashboard Image */}
          <div className="mt-16 relative mx-auto max-w-5xl">
            <div className="rounded-2xl border border-gray-200 bg-gray-900/5 p-2 shadow-2xl backdrop-blur-sm">
              <div className="rounded-xl bg-white border border-gray-200 overflow-hidden aspect-[16/9] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <Image
                  src={DashBoardImg}
                  // width={500}
                  // height={500}
                  alt="Picture of the author"
                />
                {/* <div className="text-center p-8">
                  <LayoutDashboard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-400 font-medium">
                    Your Beautiful Dashboard Awaits
                  </p>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to launch
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stop wasting time on boilerplate. We've handled the complex
              architecture so you can focus on your core product.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <LayoutDashboard className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Workspace Management
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Create isolated workspaces for different teams or clients. Keep
                data strictly separated and organized.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Role-Based Access
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Built-in Owner and Member roles with strict Row Level Security
                (RLS) policies in PostgreSQL.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Team Collaboration
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Invite members, assign tasks, and track progress with a
                beautiful, real-time updated interface.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to build your SaaS?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Join developers who are shipping their products faster with
            SaaSFoundry.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition"
          >
            Get Started for Free <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="mt-6 text-sm text-gray-500 flex items-center justify-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" /> No credit card
            required
            <span className="mx-2">•</span>
            <CheckCircle className="h-4 w-4 text-green-500" /> 14-day free trial
            on Pro
          </p>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            <span className="font-bold text-gray-900">SaaSFoundry</span>
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} SaaSFoundry. Built for developers.
          </p>
        </div>
      </footer>
    </div>
  );
}
