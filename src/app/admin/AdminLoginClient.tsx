"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle,
  ExternalLink 
} from "lucide-react";
import { loginAdminAction } from "@/app/actions/admin";

export default function AdminLoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState("muzamilateeq423@gmail.com");
  const [password, setPassword] = useState("Muzamil@aura");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await loginAdminAction({ email, password });
      if (res.success) {
        window.location.href = "/admin";
      } else {
        setErrorMessage(res.error || "Invalid email or password");
      }
    } catch {
      setErrorMessage("Network error occurred during authentication");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] flex flex-col justify-between py-12 px-4 sm:px-6 font-sans selection:bg-zinc-950 selection:text-white">
      
      {/* Top Brand Bar */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 text-zinc-900 group">
          <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-white font-serif text-base font-light">
            A
          </div>
          <span className="font-serif text-lg tracking-[0.25em] uppercase font-light">
            Aura
          </span>
        </Link>

        <Link
          href="/"
          className="text-xs font-semibold text-zinc-500 hover:text-zinc-950 flex items-center gap-1 transition-colors uppercase tracking-wider"
        >
          <span>Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md mx-auto w-full my-auto py-8">
        <div className="bg-white border border-zinc-200/90 rounded-2xl shadow-xl p-8 sm:p-10 space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] text-[#8C7355] border border-[#E8E2D8] flex items-center justify-center mx-auto shadow-2xs">
              <Lock className="w-5 h-5 text-[#8C7355]" />
            </div>
            
            <div className="pt-2">
              <span className="px-2.5 py-0.5 rounded bg-zinc-100 text-zinc-600 text-[10px] font-bold tracking-widest uppercase border border-zinc-200">
                Restricted Access
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-light text-zinc-950 pt-1">
              Executive Portal Login
            </h1>
            <p className="text-xs text-zinc-500 leading-relaxed font-light">
              Enter authorized administrator credentials to manage flacons, client orders, and store operations.
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <p className="font-medium">{errorMessage}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-[11px] font-bold tracking-widest uppercase text-zinc-700 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  autoFocus
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@auraparfums.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none transition-all placeholder:text-zinc-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[11px] font-bold tracking-widest uppercase text-zinc-700 mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none transition-all placeholder:text-zinc-400 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-700 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Authenticate & Enter</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Security Badge */}
          <div className="pt-4 border-t border-zinc-100 flex items-center justify-center gap-2 text-[11px] text-zinc-400 font-light">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted Session • Single-Device Protected</span>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md mx-auto text-center text-[11px] text-zinc-400 font-light">
        © {new Date().getFullYear()} Aura Haute Parfumerie. Internal Administration System.
      </div>

    </div>
  );
}
