"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/services/api";
import { Calendar, Search, RefreshCw, Mail, Phone, Sparkles } from "lucide-react";

export default function OrganizersPage() {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      const res = await api.get("/admin/organizers", {
        params: { search: search || undefined },
      });
      setOrganizers(res.data.data || []);
    } catch (err) {
      console.error("Failed to load organizers:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <DashboardLayout
      title="Event Organizers"
      subtitle="Registered event creators, hosts & production teams"
    >
      <div className="bg-[#0f0f0f] border border-zinc-800 rounded-2xl p-4 mb-6 flex justify-between items-center">
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 gap-2.5 w-full max-w-md">
          <Search size={16} className="text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search organizers..."
            className="bg-transparent text-sm text-white placeholder-zinc-500 outline-none w-full"
          />
        </div>
        <button
          onClick={loadData}
          className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="bg-[#0f0f0f] border border-zinc-800/80 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/40 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              <th className="py-3.5 px-5">Organizer</th>
              <th className="py-3.5 px-4">Contact</th>
              <th className="py-3.5 px-4">Events Created</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-5 text-right">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-zinc-500">
                  Loading organizers...
                </td>
              </tr>
            ) : organizers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-zinc-500">
                  No organizers found
                </td>
              </tr>
            ) : (
              organizers.map((org) => (
                <tr key={org.id} className="hover:bg-zinc-900/30 transition">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold flex items-center justify-center">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <div className="font-semibold text-white">
                          {org.fullName}
                        </div>
                        <div className="text-xs text-zinc-500">{org.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-xs text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <Mail size={12} className="text-zinc-500" />
                      <span>{org.email}</span>
                    </div>
                    {org.phone && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <Phone size={12} className="text-zinc-500" />
                        <span>{org.phone}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      <Sparkles size={14} className="text-[#10E7D4]" />
                      <span>{org._count?.events || 0}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        org.isSuspended
                          ? "bg-red-500/10 text-red-400"
                          : "bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      {org.isSuspended ? "Suspended" : "Active"}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right text-xs text-zinc-500">
                    {new Date(org.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
