"use client";

import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/services/api";
import { RefreshCw, Save } from "lucide-react";

const SETTING_FIELDS = [
  ["platformFeePercent", "Platform fee (%)"],
  ["currency", "Currency"],
  ["supportEmail", "Support email"],
  ["maintenanceMode", "Maintenance mode (true/false)"],
  ["payoutPeriodDays", "Payout period (days)"],
];

export default function SettingsPage() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/admin/settings");
      setSettings(response.data || {});
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Could not load platform settings."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  async function saveSettings(event) {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      setNotice("");
      const response = await api.patch("/admin/settings", settings);
      setSettings(response.data || settings);
      setNotice("Platform settings saved.");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Could not save platform settings."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardLayout
      title="Platform Settings"
      subtitle="Manage service fees, currency, support contact and maintenance controls"
    >
      {error && (
        <p role="alert" className="mb-4 rounded-xl border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="mb-4 rounded-xl border border-emerald-900 bg-emerald-950/40 p-3 text-sm text-emerald-300">
          {notice}
        </p>
      )}
      <form
        onSubmit={saveSettings}
        className="max-w-3xl rounded-2xl border border-zinc-800 bg-[#0f0f0f] p-5"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-semibold text-white">General configuration</h2>
          <button
            type="button"
            onClick={loadSettings}
            disabled={loading}
            aria-label="Refresh settings"
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 hover:text-white disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
        <div className="space-y-4">
          {SETTING_FIELDS.map(([key, label]) => (
            <label key={key} className="grid gap-2 text-sm text-zinc-300 sm:grid-cols-[220px_1fr] sm:items-center">
              <span>{label}</span>
              <input
                value={settings[key] ?? ""}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    [key]: event.target.value,
                  }))
                }
                disabled={loading}
                className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-[#10E7D4]"
              />
            </label>
          ))}
        </div>
        <button
          type="submit"
          disabled={loading || saving}
          className="mt-6 flex items-center gap-2 rounded-xl bg-[#10E7D4] px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
        >
          <Save size={15} />
          {saving ? "Saving..." : "Save settings"}
        </button>
      </form>
    </DashboardLayout>
  );
}
