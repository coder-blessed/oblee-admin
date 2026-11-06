"use client";

import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/services/api";
import { FileText, RefreshCw, Search } from "lucide-react";

export default function AuditPage() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/admin/audit-logs", {
        params: search.trim() ? { search: search.trim() } : {},
      });
      setLogs(response.data.data || []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Could not load audit logs."
      );
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(loadLogs, 300);
    return () => clearTimeout(timer);
  }, [loadLogs]);

  return (
    <DashboardLayout
      title="Audit Logs"
      subtitle="Review account, moderation and administrative activity"
    >
      <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-[#0f0f0f] p-4">
        <div className="flex w-full max-w-md items-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2">
          <Search size={16} className="text-zinc-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search descriptions, users or IPs..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
          />
        </div>
        <button
          onClick={loadLogs}
          disabled={loading}
          aria-label="Refresh audit logs"
          className="rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-400 hover:text-white disabled:opacity-50"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
        </button>
      </div>
      {error && (
        <p role="alert" className="mb-4 rounded-xl border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">
          {error}
        </p>
      )}
      <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#0f0f0f]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/40 text-xs uppercase tracking-wider text-zinc-400">
                <th className="px-5 py-3.5">Activity</th>
                <th className="px-4 py-3.5">Actor</th>
                <th className="px-4 py-3.5">Resource</th>
                <th className="px-5 py-3.5 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-zinc-500">
                    Loading audit history...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-zinc-500">
                    <FileText className="mx-auto mb-2" size={20} />
                    No audit entries found
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-900/30">
                    <td className="px-5 py-4">
                      <p className="font-medium text-white">
                        {String(log.action || "").replaceAll("_", " ")}
                      </p>
                      <p className="mt-1 text-xs text-zinc-400">
                        {log.description || "No details provided"}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-zinc-300">
                      {log.admin?.fullName || log.user?.fullName || "System"}
                    </td>
                    <td className="px-4 py-4 text-xs text-zinc-500">
                      {log.resource || "—"}
                    </td>
                    <td className="px-5 py-4 text-right text-xs text-zinc-500">
                      {new Date(log.createdAt).toLocaleString()}
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
