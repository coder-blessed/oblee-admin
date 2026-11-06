"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/services/api";
import {
  Users,
  Search,
  Filter,
  UserX,
  UserCheck,
  Shield,
  Trash2,
  RefreshCw,
  MoreVertical,
} from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (roleFilter !== "ALL") params.role = roleFilter;
      if (statusFilter !== "ALL") params.status = statusFilter;

      const res = await api.get("/admin/users", { params });
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  async function handleSuspend(id) {
    const reason = prompt("Enter suspension reason:", "Policy violation");
    if (reason === null) return;
    try {
      setActionLoading(id);
      await api.patch(`/admin/users/${id}/suspend`, { reason });
      await fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to suspend user");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReactivate(id) {
    if (!confirm("Reactivate this user account?")) return;
    try {
      setActionLoading(id);
      await api.patch(`/admin/users/${id}/reactivate`);
      await fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reactivate user");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleChangeRole(id, currentRole) {
    const newRole = prompt(
      "Enter new role (USER, ORGANIZER, VENDOR, SUPER_ADMIN):",
      currentRole
    );
    if (!newRole || newRole === currentRole) return;
    try {
      setActionLoading(id);
      await api.patch(`/admin/users/${id}/role`, { role: newRole });
      await fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update role");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to soft-delete this user?")) return;
    try {
      setActionLoading(id);
      await api.delete(`/admin/users/${id}`);
      await fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <DashboardLayout
      title="User Management"
      subtitle="Manage registered members, creators, vendors & roles"
    >
      {/* FILTER BAR */}
      <div className="bg-[#0f0f0f] border border-zinc-800 rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 gap-2.5 w-full md:w-80">
          <Search size={16} className="text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="bg-transparent text-sm text-white placeholder-zinc-500 outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-300">
            <Filter size={13} className="text-zinc-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent outline-none cursor-pointer text-white"
            >
              <option value="ALL" className="bg-zinc-900">All Roles</option>
              <option value="USER" className="bg-zinc-900">User</option>
              <option value="ORGANIZER" className="bg-zinc-900">Organizer</option>
              <option value="VENDOR" className="bg-zinc-900">Vendor</option>
              <option value="SUPER_ADMIN" className="bg-zinc-900">Super Admin</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-300">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent outline-none cursor-pointer text-white"
            >
              <option value="ALL" className="bg-zinc-900">All Status</option>
              <option value="ACTIVE" className="bg-zinc-900">Active</option>
              <option value="SUSPENDED" className="bg-zinc-900">Suspended</option>
            </select>
          </div>

          <button
            onClick={fetchUsers}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
            title="Refresh"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="bg-[#0f0f0f] border border-zinc-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/40 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-3.5 px-5">Member</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Events</th>
                <th className="py-3.5 px-4">Services</th>
                <th className="py-3.5 px-4">Joined</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#10E7D4] border-t-transparent rounded-full animate-spin" />
                      <span>Loading user accounts...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    No users match current criteria
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-900/30 transition">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-[#10E7D4]">
                          {u.avatar ? (
                            <img
                              src={u.avatar}
                              alt=""
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            u.fullName?.charAt(0) || "U"
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {u.fullName || "Unnamed User"}
                          </div>
                          <div className="text-xs text-zinc-500">{u.email}</div>
                          {u.phone && (
                            <div className="text-[11px] text-zinc-600">
                              {u.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-200">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {u.isSuspended ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                          Suspended
                        </span>
                      ) : u.isActive ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Active
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-zinc-300 font-medium">
                      {u._count?.events || 0}
                    </td>
                    <td className="py-4 px-4 text-zinc-300 font-medium">
                      {u._count?.services || 0}
                    </td>
                    <td className="py-4 px-4 text-xs text-zinc-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleChangeRole(u.id, u.role)}
                          disabled={actionLoading === u.id}
                          className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
                          title="Change Role"
                        >
                          <Shield size={14} />
                        </button>
                        {u.isSuspended ? (
                          <button
                            onClick={() => handleReactivate(u.id)}
                            disabled={actionLoading === u.id}
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition"
                            title="Reactivate Account"
                          >
                            <UserCheck size={14} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSuspend(u.id)}
                            disabled={actionLoading === u.id}
                            className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition"
                            title="Suspend Account"
                          >
                            <UserX size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(u.id)}
                          disabled={actionLoading === u.id}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                          title="Deactivate Account"
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
