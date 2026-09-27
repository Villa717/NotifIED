import { useState, useEffect } from "react";
import {
  Send,
  Calendar,
  Clock,
  MapPin,
  FileText,
  AlertCircle,
  RefreshCw,
  Tag,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

export function FacilitatorInterface({ onLogout }: { onLogout?: () => void }) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("CS Society");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [regLink, setRegLink] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 1. Fetch Submitted Events from Database
  const fetchMyEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_id", { ascending: false });

    if (error) {
      console.error("Error fetching events:", error.message);
    } else if (data) {
      setEvents(data);
    }
    setLoading(false);
  };

  // 2. Realtime Listener: Updates status immediately when Admin approves/rejects
  useEffect(() => {
    fetchMyEvents();

    const channel = supabase
      .channel("facilitator-events-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        () => {
          fetchMyEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 3. Submit Event to Database
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitting(true);

  // Exact columns from your public.events table
  const payload = {
    title: title.trim(),
    venue: venue.trim(),
    description: description.trim() || `Org: ${organization} | Date: ${date} (${startTime}-${endTime})`,
    status: "pending",
    external_registration_link: regLink || null,
    facilitator_id: null,
  };

  const { error } = await supabase.from("events").insert([payload]);

  if (error) {
    alert(`Submission error: ${error.message}`);
  } else {
    alert("Proposal submitted successfully to the Database!");
    setTitle("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setVenue("");
    setDescription("");
    setRegLink("");
    fetchMyEvents();
  }
  setSubmitting(false);
};

  return (
    <div className="h-full w-full bg-[#0B132B] text-white flex flex-col overflow-y-auto">
      {/* Subheader */}
      <div className="px-8 py-4 border-b border-white/10 bg-[#0E1733] flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-base font-bold tracking-tight">Event Proposal Portal</h1>
          <p className="text-xs text-[#8D99AE]">Submit event proposals and track your clearance approvals in real-time.</p>
        </div>
        <button
          onClick={fetchMyEvents}
          className="p-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors flex items-center gap-2 text-xs cursor-pointer"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Main Grid */}
      <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Proposal Form (5 Cols) */}
        <div className="lg:col-span-5 bg-[#16203D] border border-white/10 rounded-2xl p-6 shadow-xl h-fit">
          <h2 className="text-xs font-bold tracking-wider text-[#FDB813] uppercase mb-4 flex items-center gap-2">
            <FileText className="size-4" /> Submit New Proposal
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
            <div>
              <label className="text-xs font-semibold text-[#8D99AE] block mb-1">Event Title *</label>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Annual Tech Hackathon"
                className="w-full p-2.5 rounded-xl bg-[#0B132B] border border-white/10 text-xs text-white focus:border-[#FDB813] outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#8D99AE] block mb-1">Student Organization *</label>
              <input
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g., Computer Science Society"
                className="w-full p-2.5 rounded-xl bg-[#0B132B] border border-white/10 text-xs text-white focus:border-[#FDB813] outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-semibold text-[#8D99AE] block mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 rounded-xl bg-[#0B132B] border border-white/10 text-xs text-white focus:border-[#FDB813] outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8D99AE] block mb-1">Start *</label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-2 rounded-xl bg-[#0B132B] border border-white/10 text-xs text-white focus:border-[#FDB813] outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8D99AE] block mb-1">End *</label>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full p-2 rounded-xl bg-[#0B132B] border border-white/10 text-xs text-white focus:border-[#FDB813] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#8D99AE] block mb-1">Venue *</label>
              <input
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g., Multipurpose Hall 1"
                className="w-full p-2.5 rounded-xl bg-[#0B132B] border border-white/10 text-xs text-white focus:border-[#FDB813] outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#8D99AE] block mb-1">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Objectives and program flow..."
                className="w-full p-2.5 rounded-xl bg-[#0B132B] border border-white/10 text-xs text-white focus:border-[#FDB813] outline-none resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#8D99AE] block mb-1">Registration Link (Optional)</label>
              <input
                value={regLink}
                onChange={(e) => setRegLink(e.target.value)}
                placeholder="https://forms.gle/..."
                className="w-full p-2.5 rounded-xl bg-[#0B132B] border border-white/10 text-xs text-white focus:border-[#FDB813] outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-[#FDB813] hover:bg-[#e0a20f] text-black font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer mt-2"
            >
              <Send className="size-3.5" />
              {submitting ? "Submitting Proposal..." : "Submit Proposal"}
            </button>
          </form>
        </div>

        {/* Right: Proposal List & Status (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold tracking-wider text-white uppercase">Your Submitted Proposals</h2>
            <span className="text-xs text-[#8D99AE]">{events.length} Total</span>
          </div>

          <div className="space-y-3">
            {events.length === 0 ? (
              <div className="p-8 rounded-xl bg-[#16203D] border border-white/10 text-center text-xs text-[#8D99AE]">
                No proposals submitted yet. Fill out the form to submit one.
              </div>
            ) : (
              events.map((item) => (
                <div key={item.event_id} className="p-4 rounded-xl bg-[#16203D] border border-white/10 space-y-2 text-left">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-white">{item.title}</h3>
                      <p className="text-xs text-[#8D99AE]">{item.organization || "Student Org"}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                        item.status === "pending"
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : item.status === "approved"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : item.status === "needs_revision"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {item.status ? item.status.replace("_", " ") : "Pending"}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-white/60">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3 text-[#FDB813]" /> {item.event_date || "No date set"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3 text-[#FDB813]" /> {item.start_time || "--"} - {item.end_time || "--"}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3 text-[#FDB813]" /> {item.venue || "No venue"}
                    </span>
                  </div>

                  {item.status === "needs_revision" && item.admin_feedback && (
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 mt-2">
                      <span className="font-bold flex items-center gap-1 mb-0.5 text-amber-400">
                        <AlertCircle className="size-3.5" /> Coordinator Revision Notes:
                      </span>
                      <p className="text-amber-200/90">{item.admin_feedback}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}