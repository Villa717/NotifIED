import { useState, useEffect } from "react";
import {
  Calendar,
  Building2,
  Clock,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Inbox,
  Eye,
  EyeOff,
  LogOut,
} from "lucide-react";
import { supabase } from "../lib/supabase";

export interface EventRecord {
  event_id: number;
  title: string;
  organization?: string;
  event_date: string;
  start_time: string;
  end_time: string;
  venue: string;
  description: string;
  tags?: string[];
  status: "pending" | "approved" | "revision" | "needs_revision" | "completed" | "rejected";
  admin_feedback?: string;
  external_registration_link?: string;
  registration_link?: string;
  has_qr_code?: boolean;
  qr_code_url?: string;
  created_at?: string;
}

export default function CoordinatorView() {
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
    setEmail("");
    setPassword("");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen w-full bg-[#EAEFF5] flex flex-col items-center justify-center p-4 font-sans text-slate-900">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-xs border border-slate-200 text-slate-600 text-xs font-semibold mb-6">
          <span className="size-2 rounded-full bg-blue-600"></span>
          NOTIFIED: ADMIN COORDINATOR
        </div>

        <div className="w-full max-w-[420px] bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center">
          <h1 className="text-2xl font-serif font-bold text-slate-900 mb-1">Admin Login</h1>
          <p className="text-xs text-slate-500 mb-6">Review, clear, and publish campus event proposals.</p>

          <form onSubmit={handleLogin} className="text-left space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="coordinator@apc.edu.ph"
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
              Sign In to Coordinator Portal
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
    <div className="min-h-screen w-full flex flex-col bg-[#0B132B]">
      {/* Top Banner Header with Exit to Login */}
      <header className="h-12 bg-[#0E1733] px-6 flex items-center justify-between text-xs text-white z-30 shadow-md border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Portal:</span>
          <span className="font-bold text-blue-400 uppercase tracking-wide">
            Admin Coordinator Portal
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <LogOut className="size-3.5" />
          Exit to Login
        </button>
      </header>

      {/* Main Coordinator Interface */}
      <main className="flex-1 flex overflow-hidden">
        <CoordinatorInterface />
      </main>
    </div>
  );
}

export function CoordinatorInterface() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [revisionFeedback, setRevisionFeedback] = useState("");
  const [showRevisionModal, setShowRevisionModal] = useState(false);

  const fetchQueue = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_id", { ascending: false });

    if (error) {
      console.error("Error fetching queue from Supabase:", error.message);
    } else if (data) {
      setEvents(data as EventRecord[]);
      if (data.length > 0 && !selectedEventId) {
        setSelectedEventId(data[0].event_id);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQueue();

    const channel = supabase
      .channel("events-queue-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        () => {
          fetchQueue();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const selectedEvent = events.find((e) => e.event_id === selectedEventId) || events[0];

  const handleUpdateStatus = async (
    status: "approved" | "rejected" | "revision",
    feedback?: string
  ) => {
    if (!selectedEvent) return;
    setActionLoading(true);

    const dbStatus = status === "revision" ? "needs_revision" : status;

    const { error } = await supabase
      .from("events")
      .update({
        status: dbStatus,
        admin_feedback: feedback || null,
        updated_at: new Date().toISOString(),
      })
      .eq("event_id", selectedEvent.event_id);

    if (error) {
      console.error(`Failed to update status to ${status}:`, error.message);
      alert(`Could not submit: ${error.message}`);
    } else {
      setShowRevisionModal(false);
      setRevisionFeedback("");
      await fetchQueue();
    }
    setActionLoading(false);
  };

  return (
    <div className="flex-1 flex h-full w-full overflow-hidden bg-[#0B132B] text-white">
      {/* ── LEFT COLUMN: Event Queue List ── */}
      <div className="w-[380px] border-r border-white/10 flex flex-col h-full bg-[#0D1836] shrink-0">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight">Paper Approval Queue</h1>
            <p className="text-xs text-[#8D99AE] mt-0.5">
              {events.filter((e) => e.status === "pending").length} proposals awaiting review
            </p>
          </div>
          <button
            onClick={fetchQueue}
            title="Refresh from Supabase"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading && events.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-center text-[#8D99AE]">
              <RefreshCw className="size-6 animate-spin mb-2 text-[#4A90D9]" />
              <p className="text-xs">Connecting to Supabase...</p>
            </div>
          )}

          {!loading && events.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-center text-[#8D99AE] p-4">
              <Inbox className="size-10 mb-3 opacity-40 text-white" />
              <p className="text-sm font-semibold text-white">Queue is empty</p>
              <p className="text-xs mt-1">No event proposals submitted yet in the database.</p>
            </div>
          )}

          {events.map((item) => {
            const isSelected = selectedEvent?.event_id === item.event_id;
            return (
              <div
                key={item.event_id}
                onClick={() => setSelectedEventId(item.event_id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#1C2541] border-[#FDB813] shadow-md"
                    : "bg-[#16203D] border-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="font-semibold text-sm truncate text-white">{item.title}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize shrink-0 ${
                      item.status === "pending"
                        ? "bg-blue-500/20 text-blue-400"
                        : item.status === "approved"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : item.status === "revision" || item.status === "needs_revision"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {item.status ? item.status.replace("_", " ") : "pending"}
                  </span>
                </div>

                <p className="text-xs text-[#8D99AE] mb-2">{item.organization || "Student Org"}</p>

                <div className="flex items-center gap-3 text-[11px] text-white/60 mb-2.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3 text-[#FDB813]" /> {item.event_date || "No date set"}
                  </span>
                  <span className="flex items-center gap-1 truncate">
                    <Building2 className="size-3 text-[#FDB813]" /> {item.venue || "No venue"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {(item.tags || []).slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-white/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── RIGHT COLUMN: Detail & Decision Pane ── */}
      {selectedEvent ? (
        <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#0B132B]">
          <div className="p-7 border-b border-white/10 bg-[#0E1733] flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  {selectedEvent.title}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-500/20 text-blue-400">
                  {selectedEvent.status ? selectedEvent.status.replace("_", " ") : "pending"}
                </span>
              </div>
              <p className="text-sm text-[#8D99AE]">{selectedEvent.organization || "Student Org"}</p>
            </div>
          </div>

          <div className="p-7 space-y-7 flex-1">
            {/* Event Logistics Grid */}
            <div>
              <h3 className="text-xs font-bold text-[#8D99AE] uppercase tracking-wider mb-3">
                Event Logistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-[#16203D] rounded-xl border border-white/5">
                  <p className="text-xs text-[#8D99AE] mb-1 flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-[#FDB813]" /> Date
                  </p>
                  <p className="text-sm font-semibold">{selectedEvent.event_date || "No date set"}</p>
                </div>
                <div className="p-4 bg-[#16203D] rounded-xl border border-white/5">
                  <p className="text-xs text-[#8D99AE] mb-1 flex items-center gap-1.5">
                    <Clock className="size-3.5 text-[#FDB813]" /> Schedule
                  </p>
                  <p className="text-sm font-semibold">
                    {selectedEvent.start_time || "--"} – {selectedEvent.end_time || "--"}
                  </p>
                </div>
                <div className="p-4 bg-[#16203D] rounded-xl border border-white/5">
                  <p className="text-xs text-[#8D99AE] mb-1 flex items-center gap-1.5">
                    <Building2 className="size-3.5 text-[#FDB813]" /> Venue
                  </p>
                  <p className="text-sm font-semibold truncate">{selectedEvent.venue || "No venue"}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold text-[#8D99AE] uppercase tracking-wider mb-2">
                Proposal Description
              </h3>
              <div className="p-4 bg-[#16203D] rounded-xl border border-white/5 text-sm leading-relaxed text-white/90">
                {selectedEvent.description || "No description provided."}
              </div>
            </div>

            {/* Promotional Assets & Links */}
            <div>
              <h3 className="text-xs font-bold text-[#8D99AE] uppercase tracking-wider mb-3">
                Promotional Assets
              </h3>
              <div className="p-4 bg-[#16203D] rounded-xl border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#8D99AE] mb-0.5">Registration Link</p>
                  <p className="text-sm font-medium text-white truncate max-w-md">
                    {selectedEvent.external_registration_link ||
                      selectedEvent.registration_link ||
                      "No external link provided"}
                  </p>
                </div>
                {(selectedEvent.external_registration_link || selectedEvent.registration_link) && (
                  <a
                    href={selectedEvent.external_registration_link || selectedEvent.registration_link}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs flex items-center gap-1.5 transition-colors"
                  >
                    Open <ExternalLink className="size-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Fixed Decision Footer Actions */}
          <div className="p-5 border-t border-white/10 bg-[#0E1733] flex items-center justify-end gap-3">
            <button
              onClick={() => handleUpdateStatus("rejected")}
              disabled={actionLoading}
              className="px-5 py-2.5 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
            >
              Reject
            </button>
            <button
              onClick={() => setShowRevisionModal(true)}
              disabled={actionLoading}
              className="px-5 py-2.5 rounded-xl border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
            >
              Needs Revision
            </button>
            <button
              onClick={() => handleUpdateStatus("approved")}
              disabled={actionLoading}
              className="px-7 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="size-4" />
              Approve Event
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-[#8D99AE] text-sm">
          Select an event from the left queue to view details.
        </div>
      )}

      {/* Revision Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#16203D] border border-white/15 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Request Revisions</h3>
            <p className="text-xs text-[#8D99AE] mb-4">
              Enter the feedback or document corrections required by the SAO Office:
            </p>
            <textarea
              rows={4}
              value={revisionFeedback}
              onChange={(e) => setRevisionFeedback(e.target.value)}
              placeholder="e.g., Please update the schedule and attach the endorsed APF with adviser signature..."
              className="w-full p-3 rounded-xl bg-[#0B132B] border border-white/10 text-xs text-white placeholder:text-white/30 outline-none focus:border-[#FDB813] resize-none mb-4"
            />
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowRevisionModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-[#8D99AE] hover:text-white border border-white/10 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus("revision", revisionFeedback)}
                disabled={!revisionFeedback.trim() || actionLoading}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black disabled:opacity-40 cursor-pointer"
              >
                Send Revision Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}