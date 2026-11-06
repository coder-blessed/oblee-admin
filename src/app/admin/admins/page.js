"use client";

import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/services/api";
import { Plus, RefreshCw, Shield, Trash2, UserCheck, UserX } from "lucide-react";

const ROLES = [
  "ADMIN",
  "SUPER_ADMIN",
  "FINANCE_ADMIN",
  "SUPPORT_ADMIN",
  "MODERATION_ADMIN",
];

const emptyForm = {
  fullName: "",
  email: "",
  password: "",
  role: "SUPPORT_ADMIN",
};

export default function AdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState("");

  const loadAdmins = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/admin/admins");
      setAdmins(Array.isArray(response.data) ? response.data : []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not load admins.");
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  async function createAdmin(event) {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      await api.post("/admin/admins", {
        ...form,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
      });
      setForm(emptyForm);
      await loadAdmins();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Could not create this admin."
      );
    } finally {
      setSaving(false);
    }
  }

  async function updateRole(adminId, role) {
    try {
      setActionId(adminId);
      setError("");
      await api.patch(`/admin/admins/${adminId}/role`, { role });
      await loadAdmins();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Could not update the admin role."
      );
    } finally {
      setActionId(null);
    }
  }

  async function toggleSuspension(admin) {
    const action = admin.suspended ? "restore" : "suspend";
    if (!window.confirm(`${admin.suspended ? "Restore" : "Suspend"} ${admin.email}?`)) {
      return;
    }
    try {
      setActionId(admin.id);
      setError("");
      await api.patch(`/admin/admins/${admin.id}/${action}`);
      await loadAdmins();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Could not update this admin."
      );
    } finally {
      setActionId(null);
    }
  }

  async function deleteAdmin(admin) {
    if (!window.confirm(`Remove ${admin.email} from the admin team?`)) return;
    try {
      setActionId(admin.id);
      setError("");
      await api.delete(`/admin/admins/${admin.id}`);
      await loadAdmins();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Could not remove this admin."
      );
    } finally {
      setActionId(null);
    }
  }

  async function resetPassword(admin) {
    const password = window.prompt(
      `Enter a new password for ${admin.email} (at least 8 characters):`
    );
    if (password === null) return;
    if (password.length < 8) {
      setError("New passwords must be at least 8 characters.");
      return;
    }
    try {
      setActionId(admin.id);
      setError("");
      await api.post(`/admin/admins/${admin.id}/reset-password`, { password });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Could not reset the password."
      );
    } finally {
      setActionId(null);
    }
  }

  return (
    <DashboardLayout
      title="Admin Team"
      subtitle="Manage administrator accounts and access roles"
    >
      {error && (
        <p role="alert" className="mb-4 rounded-xl border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <form
        onSubmit={createAdmin}
        className="mb-6 grid gap-3 rounded-2xl border border-zinc-800 bg-[#0f0f0f] p-4 sm:grid-cols-2 xl:grid-cols-5"
      >
        <input
          required
          value={form.fullName}
          onChange={(event) =>
            setForm((current) => ({ ...current, fullName: event.target.value }))
          }
          placeholder="Full name"
          className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white outline-none"
        />
        <input
          required
          type="email"
          value={form.email}
          onChange={(event) =>
            setForm((current) => ({ ...current, email: event.target.value }))
          }
          placeholder="Email"
          className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white outline-none"
        />
        <input
          required
          minLength={8}
          type="password"
          value={form.password}
          onChange={(event) =>
            setForm((current) => ({ ...current, password: event.target.value }))
          }
          placeholder="Temporary password"
          className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white outline-none"
        />
        <select
          value={form.role}
          onChange={(event) =>
            setForm((current) => ({ ...current, role: event.target.value }))
          }
          className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white outline-none"
        >
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {role.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#10E7D4] px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
        >
          <Plus size={16} />
          {saving ? "Creating..." : "Add admin"}
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#0f0f0f]">
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Shield size={16} className="text-[#10E7D4]" />
            Administrator accounts
          </div>
          <button
            onClick={loadAdmins}
            disabled={loading}
            aria-label="Refresh admins"
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 hover:text-white disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/40 text-xs uppercase tracking-wider text-zinc-400">
                <th className="px-5 py-3.5">Administrator</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Last login</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-500">
                    Loading administrators...
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-500">
                    No administrator accounts found
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-zinc-900/30">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-white">
                        {admin.fullName || "Administrator"}
                      </p>
                      <p className="text-xs text-zinc-500">{admin.email}</p>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={admin.role}
                        disabled={actionId === admin.id}
                        onChange={(event) =>
                          updateRole(admin.id, event.target.value)
                        }
                        aria-label={`Role for ${admin.email}`}
                        className="rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-white"
                      >
                        {ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role.replaceAll("_", " ")}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <span className={admin.suspended ? "text-red-400" : "text-emerald-400"}>
                        {admin.suspended ? "Suspended" : admin.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-zinc-500">
                      {admin.lastLoginAt
                        ? new Date(admin.lastLoginAt).toLocaleString()
                        : "Never"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => resetPassword(admin)}
                          disabled={actionId === admin.id}
                          className="rounded-lg border border-zinc-800 px-2.5 py-1.5 text-xs text-zinc-300 hover:text-white disabled:opacity-50"
                        >
                          Reset password
                        </button>
                        <button
                          onClick={() => toggleSuspension(admin)}
                          disabled={actionId === admin.id}
                          aria-label={`${admin.suspended ? "Restore" : "Suspend"} ${admin.email}`}
                          className="rounded-lg border border-zinc-800 p-2 text-zinc-400 hover:text-white disabled:opacity-50"
                        >
                          {admin.suspended ? <UserCheck size={15} /> : <UserX size={15} />}
                        </button>
                        <button
                          onClick={() => deleteAdmin(admin)}
                          disabled={actionId === admin.id}
                          aria-label={`Remove ${admin.email}`}
                          className="rounded-lg border border-zinc-800 p-2 text-red-400 hover:text-red-300 disabled:opacity-50"
                        >
                          <Trash2 size={15} />
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
