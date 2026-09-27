import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FacilitatorInterface } from "./components/FacilitatorInterface";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen w-full bg-[#EAEFF5] flex flex-col items-center justify-center p-4 font-sans">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-xs border border-slate-200 text-slate-600 text-xs font-semibold mb-6">
          <span className="size-2 rounded-full bg-emerald-600"></span>
          NOTIFIED: FACILITATOR PORTAL
        </div>

        <div className="w-full max-w-[420px] bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center">
          <h1 className="text-2xl font-serif font-bold text-slate-900 mb-1">Facilitator Login</h1>
          <p className="text-xs text-slate-500 mb-6">Welcome back! Submit and track your event proposals.</p>

          <form onSubmit={handleLogin} className="text-left space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="facilitator@organization.edu"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0E1733]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0E1733]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-blue-600" />
                Remember Me
              </label>
              <span className="text-blue-600 hover:underline font-medium cursor-pointer">
                Forgot Password
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#0E1733] hover:bg-[#16203D] text-white text-sm font-bold transition-colors cursor-pointer"
            >
              Sign In as Facilitator
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-white px-2 text-slate-400">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsLoggedIn(true)}
            className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <svg className="size-4" viewBox="0 0 21 21">
              <path fill="#f25022" d="M1 1h9v9H1z" />
              <path fill="#00a4ef" d="M1 11h9v9H1z" />
              <path fill="#7fba00" d="M11 1h9v9H11z" />
              <path fill="#ffb900" d="M11 11h9v9H11z" />
            </svg>
            Sign in with Microsoft
          </button>
        </div>

        <p className="text-xs text-slate-400 mt-8">© 2026 All rights reserved.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#F8FAFC]">
      <header className="h-12 bg-[#0E1733] px-6 flex items-center justify-between text-xs text-white z-30 shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Portal:</span>
          <span className="font-bold text-emerald-400 uppercase tracking-wide">
            Facilitator Portal
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer"
        >
          Exit to Login
        </button>
      </header>

      <main className="flex-1">
        <FacilitatorInterface />
      </main>
    </div>
  );
}