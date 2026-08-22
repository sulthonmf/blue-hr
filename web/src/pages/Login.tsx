import React, { useState } from "react";
import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";
import { useLanguageStore } from "../stores/useLanguageStore";
import { useThemeStore } from "../stores/useThemeStore";
import {
  Lock,
  Mail,
  Globe,
  Sun,
  Moon,
  Loader2,
  AlertCircle,
} from "lucide-react";

export const LoginPage: React.FC = () => {
  const { setAuth } = useAuthStore();
  const { lang, toggleLanguage, t } = useLanguageStore();
  const { theme, toggleTheme } = useThemeStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/v1/auth/login", {
        email,
        password,
      });
      setAuth(res.data.token, res.data.user);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Gagal login. Periksa email & password Anda.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#090d16] flex items-center justify-center p-4 relative overflow-hidden font-sans transition-colors duration-200">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-[#2563eb]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Language & Theme Controls */}
      <div className="absolute top-6 right-6 flex items-center gap-2 z-20">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-[#2563eb] shadow-sm transition-all"
        >
          <Globe size={14} className="text-[#2563eb]" />
          <span>{lang}</span>
        </button>
        <button
          onClick={toggleTheme}
          aria-label="Ganti Tema Tampilan"
          className="p-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-200 hover:border-[#2563eb] shadow-sm transition-all"
        >
          {theme === "light" ? (
            <Sun size={16} className="text-amber-500" />
          ) : (
            <Moon size={16} className="text-indigo-400" />
          )}
        </button>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-sm bg-white dark:bg-slate-900/90 backdrop-blur-2xl p-8 rounded-[32px] border border-slate-200/80 dark:border-slate-800 shadow-xl relative z-10 transition-all">
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#2563eb] shadow-lg shadow-[#2563eb]/30 mb-4">
            <span className="text-white font-black text-2xl">B</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-display">
            BlueHR<span className="text-[#2563eb]">.</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-medium">
            {t.enterpriseTitle}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs rounded-2xl flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label htmlFor="login-email" className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">
              {t.emailLabel}
            </label>
            <div className="relative">
              <Mail
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@perusahaan.com"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-3 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/40 transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">
              {t.passwordLabel}
            </label>
            <div className="relative">
              <Lock
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-3 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/40 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2563eb] hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-[#2563eb]/25 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {t.loggingIn}
              </>
            ) : (
              t.loginBtn
            )}
          </button>
        </form>

        <p className="text-center text-[11px] text-slate-500 dark:text-slate-400 mt-6">
          {t.loginSubtitle}
        </p>
      </div>
    </div>
  );
};
