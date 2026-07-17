"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Shield,
} from "lucide-react";

import api from "@/services/api";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  async function login(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post(
        "/admin/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "admin_token",
        res.data.accessToken
      );

      router.push("/admin/dashboard");
    } catch (error) {
      alert(
        error.response?.data?.message ??
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        <div className="mb-8 text-center">

          <div className="w-20 h-20 rounded-full bg-[#66DDAA] flex items-center justify-center mx-auto">

            <Shield
              size={38}
              color="black"
            />

          </div>

          <h1 className="text-white text-4xl font-bold mt-6">
            Oblee Admin
          </h1>

          <p className="text-gray-400 mt-2">
            Secure administration portal
          </p>

        </div>

        <form
          onSubmit={login}
          className="bg-[#111111] border border-zinc-800 rounded-2xl p-8 space-y-5 shadow-2xl"
        >

          <div>

            <label className="text-sm text-gray-400">
              Email
            </label>

            <div className="relative mt-2">

              <Mail
                size={18}
                className="absolute left-4 top-4 text-gray-500"
              />

              <input
                type="email"
                required
                placeholder="admin@oblee.app"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full bg-[#1B1B1B] text-white rounded-xl pl-12 pr-4 py-4 border border-zinc-700 focus:border-[#66DDAA] outline-none"
              />

            </div>

          </div>

          <div>

            <label className="text-sm text-gray-400">
              Password
            </label>

            <div className="relative mt-2">

              <Lock
                size={18}
                className="absolute left-4 top-4 text-gray-500"
              />

              <input
                required
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Password"
                className="w-full bg-[#1B1B1B] text-white rounded-xl pl-12 pr-12 py-4 border border-zinc-700 focus:border-[#66DDAA] outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-4 top-4 text-gray-400"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

          </div>

          <button
            disabled={loading}
            className="w-full py-4 rounded-xl bg-[#66DDAA] text-black font-bold hover:opacity-90 transition"
          >
            {loading
              ? "Signing In..."
              : "Login"}
          </button>

        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          © {new Date().getFullYear()} Oblee Technologies
        </p>

      </div>

    </div>
  );
}