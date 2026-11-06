"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/services/api";
import { BellRing, Send } from "lucide-react";

const TYPES = ["booking", "message", "payment", "event", "marketing"];

export default function NotificationsPage() {
  const [form, setForm] = useState({
    userId: "",
    type: "message",
    title: "",
    body: "",
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  async function sendNotification(event) {
    event.preventDefault();
    try {
      setSending(true);
      setError("");
      setResult("");
      const response = await api.post("/admin/notifications/user", form);
      const delivery = response.data;
      if (delivery?.reason) {
        setResult(`Not sent: ${delivery.reason}.`);
      } else if (typeof delivery?.successCount === "number") {
        setResult(
          `Notification sent to ${delivery.successCount} device(s)${
            delivery.failureCount
              ? `; ${delivery.failureCount} device(s) failed`
              : ""
          }.`
        );
      } else {
        setResult("Notification request completed.");
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Could not send this notification."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <DashboardLayout
      title="Notifications"
      subtitle="Send a targeted push notification to a user"
    >
      {error && (
        <p role="alert" className="mb-4 rounded-xl border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">
          {error}
        </p>
      )}
      {result && (
        <p role="status" className="mb-4 rounded-xl border border-emerald-900 bg-emerald-950/40 p-3 text-sm text-emerald-300">
          {result}
        </p>
      )}
      <form
        onSubmit={sendNotification}
        className="max-w-2xl space-y-4 rounded-2xl border border-zinc-800 bg-[#0f0f0f] p-5"
      >
        <div className="mb-2 flex items-center gap-2 text-white">
          <BellRing size={17} className="text-[#10E7D4]" />
          <h2 className="font-semibold">New push notification</h2>
        </div>
        <label className="block space-y-2 text-sm text-zinc-300">
          <span>User ID</span>
          <input
            required
            min="1"
            step="1"
            type="number"
            value={form.userId}
            onChange={(event) =>
              setForm((current) => ({ ...current, userId: event.target.value }))
            }
            placeholder="Enter the recipient's user ID"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-[#10E7D4]"
          />
        </label>
        <label className="block space-y-2 text-sm text-zinc-300">
          <span>Notification category</span>
          <select
            value={form.type}
            onChange={(event) =>
              setForm((current) => ({ ...current, type: event.target.value }))
            }
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-white outline-none"
          >
            {TYPES.map((type) => (
              <option key={type} value={type}>
                {type[0].toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-2 text-sm text-zinc-300">
          <span>Title</span>
          <input
            required
            maxLength={100}
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({ ...current, title: event.target.value }))
            }
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-[#10E7D4]"
          />
        </label>
        <label className="block space-y-2 text-sm text-zinc-300">
          <span>Message</span>
          <textarea
            required
            maxLength={500}
            rows={4}
            value={form.body}
            onChange={(event) =>
              setForm((current) => ({ ...current, body: event.target.value }))
            }
            className="w-full resize-y rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-[#10E7D4]"
          />
        </label>
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center gap-2 rounded-xl bg-[#10E7D4] px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
        >
          <Send size={15} />
          {sending ? "Sending..." : "Send notification"}
        </button>
      </form>
    </DashboardLayout>
  );
}
