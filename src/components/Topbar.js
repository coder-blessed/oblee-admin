"use client";

import { Menu, Bell, Search, Shield } from "lucide-react";

export default function Topbar({ title, subtitle, onToggleSidebar }) {
  return (
    <header className="flex items-center justify-between py-4 px-6 lg:px-10 border-b border-zinc-800/80 bg-[#0d0d0d]/40 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
          aria-label="Toggle menu"
        >
          <Menu size={22} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {title || "Dashboard"}
          </h2>
          {subtitle && (
            <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center bg-zinc-900/90 border border-zinc-800 rounded-xl px-3.5 py-2 gap-2.5 w-64 focus-within:border-[#10E7D4]/50 transition-colors">
          <Search size={16} className="text-zinc-500" />
          <input
            placeholder="Search records..."
            className="bg-transparent text-sm text-white placeholder-zinc-500 outline-none w-full"
          />
        </div>

        <button
          className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 relative transition-colors"
          title="Notifications"
        >
          <Bell size={18} />
          <span className="w-2 h-2 rounded-full bg-[#10E7D4] absolute top-2 right-2 ring-2 ring-zinc-900" />
        </button>

        <div className="flex items-center gap-3 pl-2 border-l border-zinc-800">
          <div className="w-9 h-9 rounded-xl bg-[#10E7D4] text-black font-bold flex items-center justify-center text-sm shadow-md">
            A
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-white leading-none">
              Super Admin
            </p>
            <p className="text-[10px] text-zinc-500 mt-1">admin@oblee.app</p>
          </div>
        </div>
      </div>
    </header>
  );
}
