"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  CreditCard,
  Settings,
  Shield,
  LogOut,
  X,
  Sparkles,
  Briefcase,
  Calendar,
  Eye,
  Bell,
  HelpCircle,
  FileText,
} from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Organizers", href: "/admin/organizers", icon: Calendar },
    { name: "Vendors", href: "/admin/vendors", icon: Briefcase },
    { name: "Bookings", href: "/admin/bookings", icon: CalendarDays },
    { name: "Events", href: "/admin/events", icon: Sparkles },
    { name: "Finance", href: "/admin/finance", icon: CreditCard },
    { name: "Moderation", href: "/admin/moderation", icon: Eye },
    { name: "Notifications", href: "/admin/notification", icon: Bell },
    { name: "Support", href: "/admin/support", icon: HelpCircle },
    { name: "Audit Logs", href: "/admin/audit", icon: FileText },
    { name: "Admin Team", href: "/admin/admins", icon: Shield },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  function handleLogout() {
    localStorage.removeItem("admin_token");
    router.replace("/admin/login");
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed lg:static z-50 top-0 left-0 h-screen w-64 bg-[#0d0d0d] border-r border-zinc-800 flex flex-col p-5 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#10E7D4] flex items-center justify-center shadow-lg shadow-[#10E7D4]/10">
              <Shield size={22} className="text-black" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white tracking-wide">
                Oblee
              </h1>
              <p className="text-xs text-zinc-400">Admin Operations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-zinc-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto pr-1 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#10E7D4]/15 text-[#10E7D4] border border-[#10E7D4]/20"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/60"
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="pt-4 mt-2 border-t border-zinc-800/80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
