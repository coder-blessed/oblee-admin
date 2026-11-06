"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/services/api";
import {
  CalendarDays,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== "ALL") params.status = statusFilter;

      const res = await api.get("/admin/bookings", { params });
      setBookings(res.data.data || []);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBookings();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchBookings]);

  async function handleStatusChange(id, newStatus) {
    try {
      setActionId(id);
      await api.patch(`/admin/bookings/${id}/status`, { status: newStatus });
      await fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update booking");
    } finally {
      setActionId(null);
    }
  }

  return (
    <DashboardLayout
      title="Bookings & Reservations"
      subtitle="Track customer event ticket orders and creative service contracts"
    >
      <div className="bg-[#0f0f0f] border border-zinc-800 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 gap-2.5 w-full sm:w-80">
          <Search size={16} className="text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bookings or customers..."
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
              <option value="CONFIRMED" className="bg-zinc-900">Confirmed</option>
              <option value="PENDING" className="bg-zinc-900">Pending</option>
              <option value="COMPLETED" className="bg-zinc-900">Completed</option>
              <option value="CANCELLED" className="bg-zinc-900">Cancelled</option>
            </select>
          </div>

          <button
            onClick={fetchBookings}
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
                <th className="py-3.5 px-5">Booking ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Type & Details</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    Loading bookings...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-zinc-900/30 transition">
                    <td className="py-4 px-5 font-mono text-xs text-zinc-400">
                      {b.id.slice(0, 8)}...
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-white">
                        {b.user?.fullName || "Guest Customer"}
                      </div>
                      <div className="text-xs text-zinc-500">{b.user?.email}</div>
                    </td>
                    <td className="py-4 px-4 text-xs text-zinc-300">
                      <div className="font-semibold text-white">
                        {b.service?.title || b.event?.title || b.bookingType}
                      </div>
                      {b.date && (
                        <div className="text-zinc-500 mt-0.5">
                          {b.date} {b.startTime ? `• ${b.startTime}` : ""}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 font-bold text-[#10E7D4]">
                      ₦{Number(b.amount || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          b.status === "CONFIRMED"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : b.status === "COMPLETED"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : b.status === "CANCELLED"
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-xs text-zinc-400 font-medium">
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {b.status !== "COMPLETED" && (
                          <button
                            onClick={() => handleStatusChange(b.id, "COMPLETED")}
                            disabled={actionId === b.id}
                            className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition"
                            title="Mark as Completed"
                          >
                            <CheckCircle2 size={14} />
                          </button>
                        )}
                        {b.status !== "CANCELLED" && (
                          <button
                            onClick={() => handleStatusChange(b.id, "CANCELLED")}
                            disabled={actionId === b.id}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                            title="Cancel Booking"
                          >
                            <XCircle size={14} />
                          </button>
                        )}
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
