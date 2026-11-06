"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/services/api";
import {
  CreditCard,
  DollarSign,
  Search,
  Filter,
  ArrowUpRight,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

export default function FinancePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const fetchFinance = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== "ALL") params.status = statusFilter;

      const res = await api.get("/admin/finance", { params });
      setData(res.data);
    } catch (err) {
      console.error("Failed to load finance data:", err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFinance();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchFinance]);

  const metrics = data?.metrics || {
    totalRevenue: 0,
    totalRefunded: 0,
    netRevenue: 0,
    totalTransactions: 0,
    successfulCount: 0,
  };

  const cards = [
    {
      title: "Gross Transaction Volume",
      value: `₦${Number(metrics.totalRevenue).toLocaleString("en-US", {
        minimumFractionDigits: 2,
      })}`,
      sub: "Total payments processed",
      icon: DollarSign,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "Net Platform Volume",
      value: `₦${Number(metrics.netRevenue).toLocaleString("en-US", {
        minimumFractionDigits: 2,
      })}`,
      sub: "After reversals & refunds",
      icon: TrendingUp,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Total Transactions",
      value: metrics.totalTransactions.toLocaleString(),
      sub: `${metrics.successfulCount} successful`,
      icon: CreditCard,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      title: "Refunds & Chargebacks",
      value: `₦${Number(metrics.totalRefunded).toLocaleString("en-US", {
        minimumFractionDigits: 2,
      })}`,
      sub: "Reversed payments",
      icon: CreditCard,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
  ];

  return (
    <DashboardLayout
      title="Financial Operations"
      subtitle="Revenue, transaction ledgers, payouts & payment gateway settlements"
    >
      {/* METRIC CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {cards.map((card, idx) => {
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

      {/* FILTER BAR */}
      <div className="bg-[#0f0f0f] border border-zinc-800 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 gap-2.5 w-full sm:w-80">
          <Search size={16} className="text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search payment reference or user..."
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
              <option value="SUCCESSFUL" className="bg-zinc-900">Successful</option>
              <option value="PENDING" className="bg-zinc-900">Pending</option>
              <option value="REFUNDED" className="bg-zinc-900">Refunded</option>
              <option value="FAILED" className="bg-zinc-900">Failed</option>
            </select>
          </div>

          <button
            onClick={fetchFinance}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="bg-[#0f0f0f] border border-zinc-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/40 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-3.5 px-5">Reference</th>
                <th className="py-3.5 px-4">Payer</th>
                <th className="py-3.5 px-4">Item / Booking</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Method & Gateway</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    Loading transactions...
                  </td>
                </tr>
              ) : !data?.transactions || data.transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    No transactions recorded
                  </td>
                </tr>
              ) : (
                data.transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-zinc-900/30 transition">
                    <td className="py-4 px-5 font-mono text-xs text-white">
                      {t.reference}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-white">
                        {t.user?.fullName || "Member"}
                      </div>
                      <div className="text-xs text-zinc-500">{t.user?.email}</div>
                    </td>
                    <td className="py-4 px-4 text-xs text-zinc-300">
                      {t.booking?.service?.title ||
                        t.booking?.event?.title ||
                        "Direct transaction"}
                    </td>
                    <td className="py-4 px-4 font-bold text-[#10E7D4]">
                      ₦{Number(t.amount || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-xs text-zinc-400">
                      <span className="capitalize">{t.paymentMethod || "card"}</span> •{" "}
                      <span className="uppercase text-zinc-500">{t.provider}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          t.status === "SUCCESSFUL"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : t.status === "REFUNDED"
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right text-xs text-zinc-500">
                      {new Date(t.createdAt).toLocaleString()}
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
