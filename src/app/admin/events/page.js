"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/services/api";
import {
  Sparkles,
  Search,
  Filter,
  Check,
  X,
  Trash2,
  RefreshCw,
  MapPin,
  Calendar,
} from "lucide-react";

export default function EventsAdminPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== "ALL") params.status = statusFilter;

      const res = await api.get("/admin/events", { params });
      setEvents(res.data.data || []);
    } catch (err) {
      console.error("Failed to load events:", err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchEvents]);

  async function handleApprove(id) {
    try {
      setActionId(id);
      await api.patch(`/admin/events/${id}/approve`);
      await fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve event");
    } finally {
      setActionId(null);
    }
  }

  async function handleReject(id) {
    try {
      setActionId(id);
      await api.patch(`/admin/events/${id}/reject`);
      await fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject event");
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      setActionId(id);
      await api.delete(`/admin/events/${id}`);
      await fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete event");
    } finally {
      setActionId(null);
    }
  }

  return (
    <DashboardLayout
      title="Event Listings"
      subtitle="Moderation, approval and publishing pipeline for events"
    >
      <div className="bg-[#0f0f0f] border border-zinc-800 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 gap-2.5 w-full sm:w-80">
          <Search size={16} className="text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search event title or location..."
            className="bg-transparent text-sm text-white placeholder-zinc-500 outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-300">
            <Filter size={13} className="text-zinc-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent outline-none cursor-pointer text-white"
            >
              <option value="ALL" className="bg-zinc-900">All Status</option>
              <option value="PUBLISHED" className="bg-zinc-900">Published</option>
              <option value="SCHEDULED" className="bg-zinc-900">Scheduled</option>
              <option value="REJECTED" className="bg-zinc-900">Rejected</option>
            </select>
          </div>

          <button
            onClick={fetchEvents}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="bg-[#0f0f0f] border border-zinc-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/40 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-3.5 px-5">Event</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Date & Place</th>
                <th className="py-3.5 px-4">Organizer</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    Loading events...
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    No events found
                  </td>
                </tr>
              ) : (
                events.map((ev) => (
                  <tr key={ev.id} className="hover:bg-zinc-900/30 transition">
                    <td className="py-4 px-5">
                      <div className="font-semibold text-white">{ev.title}</div>
                      <div className="text-xs text-zinc-500 line-clamp-1 max-w-xs mt-0.5">
                        {ev.overview || "No description"}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs">
                      <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-medium">
                        {ev.eventCategory || "General"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-zinc-500" />
                        <span>{ev.eventDate || "TBA"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <MapPin size={12} className="text-zinc-500" />
                        <span className="line-clamp-1">{ev.location || "Online"}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs text-zinc-300">
                      {ev.organizer?.fullName || "Anonymous"}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          ev.status === "PUBLISHED"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : ev.status === "REJECTED"
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {ev.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {ev.status !== "PUBLISHED" && (
                          <button
                            onClick={() => handleApprove(ev.id)}
                            disabled={actionId === ev.id}
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition"
                            title="Approve Event"
                          >
                            <Check size={14} />
                          </button>
                        )}
                        {ev.status !== "REJECTED" && (
                          <button
                            onClick={() => handleReject(ev.id)}
                            disabled={actionId === ev.id}
                            className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition"
                            title="Reject Event"
                          >
                            <X size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(ev.id)}
                          disabled={actionId === ev.id}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                          title="Delete Event"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
