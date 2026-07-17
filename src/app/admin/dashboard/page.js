"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const token =
      localStorage.getItem("admin_token");

    if (!token) {
      router.replace("/admin/login");
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      Dashboard
    </div>
  );
}