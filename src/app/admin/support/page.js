"use client";

import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/services/api";
import { RefreshCw, Search, LifeBuoy } from "lucide-react";

const STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

export default function SupportPage() {
  const [tickets, setTickets] = useState([]);
  const [status, setStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const params = status === "ALL" ? {} : { status };
      const response = await api.get("/admin/support", { params });
      setTickets(response.data.tickets || []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Could not load support tickets."
      );
    } finally {
      setLoading(false);
    }
  }, [status]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  async function updateStatus(ticketId, nextStatus) {
    try {
      setUpdatingId(ticketId);
      setError("");
      await api.patch(`/admin/support/${ticketId}`, { status: nextStatus });
      await loadTickets();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Could not update this ticket."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const visibleTickets = tickets.filter((ticket) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return [ticket.name, ticket.email, ticket.subject, ticket.message]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(query));
  });

  return (
    <DashboardLayout
      title="Support"
      subtitle="Review customer support requests and track their resolution"
    >
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-[#0f0f0f] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-md items-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2">
          <Search size={16} className="text-zinc-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, email or subject..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
          />
        </div>
        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white outline-none"
          >
            <option value="ALL">All statuses</option>
            {STATUSES.map((item) => (
              <option key={item} value={item}>
                {item.replace("_", " ")}
              </option>
            ))}
          </select>
          <button
            onClick={loadTickets}
            disabled={loading}
            aria-label="Refresh support tickets"
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-400 hover:text-white disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-xl border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#0f0f0f]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/40 text-xs uppercase tracking-wider text-zinc-400">
                <th className="px-5 py-3.5">Request</th>
                <th className="px-4 py-3.5">Customer</th>
                <th className="px-4 py-3.5">Priority</th>
                <th className="px-4 py-3.5">Created</th>
                <th className="px-5 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-500">
                    Loading support tickets...
                  </td>
                </tr>
              ) : visibleTickets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-500">
                    <LifeBuoy className="mx-auto mb-2" size={20} />
                    No support tickets found
                  </td>
                </tr>
              ) : (
                visibleTickets.map((ticket) => (
                  <tr key={ticket.id} className="align-top hover:bg-zinc-900/30">
                    <td className="max-w-md px-5 py-4">
                      <p className="font-semibold text-white">{ticket.subject}</p>
                      <p className="mt-1 whitespace-pre-wrap text-xs text-zinc-400">
                        {ticket.message}
                      </p>
                      {ticket.resolution && (
                        <p className="mt-2 text-xs text-emerald-300">
                          Resolution: {ticket.resolution}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4 text-zinc-300">
                      <p>{ticket.name}</p>
                      <p className="text-xs text-zinc-500">{ticket.email}</p>
                    </td>
                    <td className="px-4 py-4 text-zinc-300">{ticket.priority}</td>
                    <td className="px-4 py-4 text-xs text-zinc-500">
                      {new Date(ticket.createdAt).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <select
                        value={ticket.status}
                        disabled={updatingId === ticket.id}
                        onChange={(event) =>
                          updateStatus(ticket.id, event.target.value)
                        }
                        aria-label={`Update status for ${ticket.subject}`}
                        className="rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-white disabled:opacity-50"
                      >
                        {STATUSES.map((item) => (
                          <option key={item} value={item}>
                            {item.replace("_", " ")}
                          </option>
                        ))}
                      </select>
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
