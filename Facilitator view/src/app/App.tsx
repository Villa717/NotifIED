import { useState, useEffect } from "react";
import { FacilitatorInterface } from "./components/FacilitatorInterface";
import { Eye, EyeOff, LogOut, AlertCircle } from "lucide-react";

// Designated prototype credentials (or accept any valid @apc.edu.ph institutional email)
const VALID_FACILITATOR_EMAIL = "facilitator@organization.edu";
const VALID_PASSWORD = "password123";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Check saved session or prefill saved email on load
  useEffect(() => {
    const savedSession = localStorage.getItem("notified_facilitator_logged_in");
    const savedEmail = localStorage.getItem("notified_facilitator_remembered_email");

    if (savedSession === "true") {
      setIsLoggedIn(true);
    }
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // 1. Validation checks
    if (!trimmedEmail || !trimmedPassword) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    // 2. Prototype Credential Verification
    // Accept either the default demo credentials or any @apc.edu.ph institutional email
    const isValid =
      (trimmedEmail === VALID_FACILITATOR_EMAIL && trimmedPassword === VALID_PASSWORD) ||
      (trimmedEmail.endsWith("@apc.edu.ph") && trimmedPassword.length >= 6);

    if (!isValid) {
      setErrorMessage(
        "Invalid credentials. Use 'facilitator@organization.edu' with password 'password123', or your @apc.edu.ph email (min. 6 characters)."
      );
      return;
    }

    // 3. Handle Remember Me & Session storage
    if (rememberMe) {
      localStorage.setItem("notified_facilitator_remembered_email", trimmedEmail);
      localStorage.setItem("notified_facilitator_logged_in", "true");
    } else {
      localStorage.removeItem("notified_facilitator_remembered_email");
      localStorage.removeItem("notified_facilitator_logged_in");
    }

    setIsLoggedIn(true);
    setPassword("");
  };

  const handleLogout = () => {
    localStorage.removeItem("notified_facilitator_logged_in");
    setIsLoggedIn(false);
    setPassword("");
    setErrorMessage("");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen w-full bg-[#EAEFF5] flex flex-col items-center justify-center p-4 font-sans text-slate-900">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-xs border border-slate-200 text-slate-600 text-xs font-semibold mb-6">
          <span className="size-2 rounded-full bg-blue-600"></span>
          NOTIFIED: FACILITATOR PORTAL
        </div>

        <div className="w-full max-w-[420px] bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center">
          <h1 className="text-2xl font-serif font-bold text-slate-900 mb-1">Facilitator Login</h1>
          <p className="text-xs text-slate-500 mb-6">
            Welcome back! Submit and track your event proposals.
          </p>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs text-left flex items-start gap-2">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="text-left space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Email</label>
              <input
                type="email"
                required
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
                  required
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
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 cursor-pointer"
                />
                Remember Me
              </label>
              <span className="text-blue-600 hover:underline font-medium cursor-pointer">
                Forgot Password
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#0E1733] hover:bg-[#16203D] text-white text-sm font-bold transition-colors cursor-pointer mt-2"
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
            onClick={() => {
              // Simulated Microsoft SSO for rapid evaluation
              setEmail("facilitator@apc.edu.ph");
              setIsLoggedIn(true);
            }}
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
    <div className="h-screen w-screen flex flex-col bg-[#0B132B] overflow-hidden">
      {/* Subheader bar with Exit to Login */}
      <header className="h-10 bg-[#0E1733] border-b border-white/10 px-6 flex items-center justify-between text-xs text-white shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Portal:</span>
          <span className="font-bold text-blue-400">Facilitator View</span>
        </div>
        <button
          onClick={handleLogout}
          className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <LogOut className="size-3" />
          Exit to Login
        </button>
      </header>

      {/* Main Facilitator Dashboard */}
      <main className="flex-1 flex overflow-hidden">
        <FacilitatorInterface onLogout={handleLogout} />
      </main>
    </div>
  );
}