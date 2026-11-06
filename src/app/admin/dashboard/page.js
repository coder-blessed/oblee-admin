"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/services/api";
import {
  Users,
  CalendarDays,
  DollarSign,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadData() {
    try {
      setRefreshing(true);
      const res = await api.get("/admin/dashboard");
      setData(res.data);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const overview = data?.overview || {
    totalUsers: 0,
    activeUsers: 0,
    totalEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
  };

  const statCards = [
    {
      title: "Total Platform Users",
      value: overview.totalUsers.toLocaleString(),
      sub: `${overview.activeUsers} Active`,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Total Bookings",
      value: overview.totalBookings.toLocaleString(),
      sub: "Services & Tickets",
      icon: CalendarDays,
      color: "text-teal-400",
      bg: "bg-teal-500/10",
      border: "border-teal-500/20",
    },
    {
      title: "Platform Gross Revenue",
      value: `₦${Number(overview.totalRevenue).toLocaleString("en-US", {
        minimumFractionDigits: 2,
      })}`,
      sub: "Verified settlements",
      icon: DollarSign,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "Published Events",
      value: overview.totalEvents.toLocaleString(),
      sub: "Active listings",
      icon: Sparkles,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
  ];

  return (
    <DashboardLayout
      title="Platform Overview"
      subtitle="Real-time monitoring, metrics & activity"
    >
      {/* Top action bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live metrics connection</span>
        </div>
        <button
          onClick={loadData}
          disabled={refreshing}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <RefreshCw
            size={14}
            className={refreshing ? "animate-spin text-[#10E7D4]" : ""}
          />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* STAT CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl bg-[#0f0f0f] border ${card.border} flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-400">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl ${card.bg} ${card.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  {loading ? "..." : card.value}
                </h3>
                <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                  <ArrowUpRight size={13} className="text-[#10E7D4]" />
                  <span>{card.sub}</span>
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* LOWER SECTION: BOOKINGS & ACTIVITY */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
        {/* RECENT BOOKINGS */}
        <div className="xl:col-span-2 bg-[#0f0f0f] border border-zinc-800/80 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-white">Recent Bookings</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Latest customer reservations and tickets
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-[11px] text-zinc-300">
              Live Feed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Booking / Item</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {data?.recentBookings && data.recentBookings.length > 0 ? (
                  data.recentBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-zinc-900/40 transition">
                      <td className="py-3.5 pr-3">
                        <div className="font-medium text-white">
                          {b.user?.fullName || "Guest Customer"}
                        </div>
                        <div className="text-xs text-zinc-500">
                          {b.user?.email || "No email"}
                        </div>
                      </td>
                      <td className="py-3.5 pr-3 text-zinc-300">
                        {b.service?.title ||
                          b.event?.title ||
                          b.eventNeed ||
                          "Booking item"}
                      </td>
                      <td className="py-3.5 pr-3 font-semibold text-[#10E7D4]">
                        ₦{Number(b.amount || 0).toLocaleString()}
                      </td>
                      <td className="py-3.5 pr-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            b.status === "CONFIRMED"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : b.status === "COMPLETED"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {b.status || "CONFIRMED"}
                        </span>
                      </td>
                      <td className="py-3.5 text-right text-xs text-zinc-500">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-500">
                      No bookings recorded yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* AUDIT ACTIVITY FEED */}
        <div className="bg-[#0f0f0f] border border-zinc-800/80 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-white">Platform Activity</h3>
            <ShieldCheck size={18} className="text-[#10E7D4]" />
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto max-h-[380px] pr-1">
            {data?.recentActivity && data.recentActivity.length > 0 ? (
              data.recentActivity.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/60"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-300">
                      {log.action.replace(/_/g, " ")}
                    </span>
                    <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(log.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                    {log.description || "System action executed"}
                  </p>
                  {(log.admin || log.user) && (
                    <p className="text-[11px] text-zinc-500 mt-1">
                      By: {log.admin?.fullName || log.user?.fullName}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-zinc-500 py-10 text-xs">
                No recent activity recorded
              </p>
            )}
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
