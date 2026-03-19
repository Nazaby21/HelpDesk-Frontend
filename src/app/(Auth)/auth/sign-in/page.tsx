"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, AlertCircle } from "lucide-react";
import { useLoginMutation } from "@/redux/feature/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/feature/auth/authSlice";
import { setToken } from "@/redux/feature/auth/tokenSlice";

export default function SignInPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic Validation
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await login({ email, password }).unwrap();
      console.log("RAW LOGIN RESPONSE:", response);
      
      const token = response.accessToken || (response as any).token;

      if (!token) {
        console.warn("API Login Response matched no token key:", response);
      } else {
        console.log("EXTRACTED TOKEN:", token);
      }
      
      // On Success
      dispatch(setToken(token));
      dispatch(
        setUser({
          user: response.user,
          refreshToken: response.refreshToken,
        })
      );
      
      // router.push("/dashboard"); // AuthGuard typically handles this
    } catch (err: any) {
      console.error("Login Error Object:", err);
      if (err?.status === "FETCH_ERROR") {
        setError("Network error: Cannot reach the backend server. Is it running?");
      } else {
        setError(err?.data?.message || err?.message || "Invalid credentials. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 sm:p-10 relative overflow-hidden">
        
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600" />

        {/* Header / Logo Area */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 border border-blue-100">
            <svg 
              className="w-6 h-6 text-blue-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome Back</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to your HelpDesk account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-medium leading-relaxed">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-slate-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="block w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-slate-900 text-sm focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10 transition-all placeholder:text-slate-400 disabled:opacity-50 disabled:bg-slate-50"
                placeholder="name@company.com"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700" htmlFor="password">
                Password
              </label>
              <button 
                type="button" 
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                tabIndex={-1}
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-slate-400" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="block w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-slate-900 text-sm focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10 transition-all placeholder:text-slate-400 disabled:opacity-50 disabled:bg-slate-50"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-all shadow-sm shadow-blue-600/20 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 disabled:hover:bg-blue-600 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Need an account?{" "}
            <a href="#" className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition-all">
              Contact IT Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
