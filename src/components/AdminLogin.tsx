import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, Mail, AlertCircle, Settings, Wrench } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showRepair, setShowRepair] = useState(false);
  const [repairUrl, setRepairUrl] = useState("");
  const [repairKey, setRepairKey] = useState("");
  const navigate = useNavigate();

  const handleRepair = () => {
    if (!repairUrl || !repairKey) {
      alert("Please enter both URL and Key");
      return;
    }
    const cleanUrl = repairUrl.trim().replace(/\/$/, ""); // Remove trailing slash
    localStorage.setItem('SUPABASE_URL_OVERRIDE', cleanUrl);
    localStorage.setItem('SUPABASE_KEY_OVERRIDE', repairKey.trim());
    window.location.reload();
  };

  const handleReset = () => {
    localStorage.removeItem('SUPABASE_URL_OVERRIDE');
    localStorage.removeItem('SUPABASE_KEY_OVERRIDE');
    window.location.reload();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;
      
      navigate("/admin/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      let message = err.message || "Invalid email or password. Please try again.";
      
      if (message.includes("Failed to fetch")) {
        message = "Connection failed. This usually means the Supabase URL is incorrect or the project is paused. Please check your environment variables.";
      }
      
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <Card className="w-full max-w-md shadow-2xl border-none rounded-3xl overflow-hidden">
        <CardHeader className="bg-slate-900 text-white p-8 text-center">
          <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-slate-900" size={32} />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
          <CardDescription className="text-slate-400">
            Sign in to manage notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 bg-white">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Mail size={16} /> Email Address
              </label>
              <Input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl border-slate-200 focus:ring-slate-900"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Lock size={16} /> Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-xl border-slate-200 focus:ring-slate-900"
              />
            </div>

            {error && (
              <div className="space-y-3">
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-start gap-2">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <div className="flex-1">
                    {error}
                    <button 
                      type="button"
                      onClick={() => setShowRepair(true)}
                      className="block mt-2 text-xs font-bold underline hover:text-red-800"
                    >
                      Click here to fix connection
                    </button>
                  </div>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-6 rounded-xl font-bold text-lg transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

        </CardContent>
      </Card>

      <Dialog open={showRepair} onOpenChange={setShowRepair}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wrench className="text-purple-600" size={20} />
              Repair Connection
            </DialogTitle>
            <DialogDescription>
              If your Vercel settings aren't working, you can paste your Supabase keys here to fix the connection directly.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-500">Supabase URL</label>
              <Input 
                placeholder="https://xyz.supabase.co"
                value={repairUrl}
                onChange={(e) => setRepairUrl(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-500">Anon Key</label>
              <Input 
                placeholder="eyJhbG..."
                value={repairKey}
                onChange={(e) => setRepairKey(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col gap-2">
            <Button 
              onClick={handleRepair}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-6 font-bold"
            >
              Save & Refresh
            </Button>
            <Button 
              variant="ghost"
              onClick={handleReset}
              className="w-full text-slate-400 hover:text-red-600 text-xs"
            >
              Reset to Default Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
