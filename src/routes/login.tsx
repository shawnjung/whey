import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Whey" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: "/", replace: true });
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/", replace: true });
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin, data: { display_name: name || email.split("@")[0] } },
        });
        if (error) throw error;
        toast.success("Account created — check your inbox if email confirmation is on.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) toast.error("Google sign-in failed");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-background">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center size-16 rounded-3xl bg-brand mb-4">
            <span className="text-2xl font-bold text-brand-ink">W</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Whey</h1>
          <p className="mt-1 text-sm text-muted-foreground">Find your Whey.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "signup" && (
            <input
              className="w-full rounded-2xl bg-surface px-4 py-3.5 text-sm ring-1 ring-border focus:ring-2 focus:ring-brand-ink focus:outline-none"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="email" required autoComplete="email"
            className="w-full rounded-2xl bg-surface px-4 py-3.5 text-sm ring-1 ring-border focus:ring-2 focus:ring-brand-ink focus:outline-none"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password" required minLength={6} autoComplete={mode === "signup" ? "new-password" : "current-password"}
            className="w-full rounded-2xl bg-surface px-4 py-3.5 text-sm ring-1 ring-border focus:ring-2 focus:ring-brand-ink focus:outline-none"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit" disabled={loading}
            className="w-full rounded-2xl bg-foreground text-brand py-3.5 text-sm font-semibold transition-transform active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? "…" : mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex-1 h-px bg-border" /> or <div className="flex-1 h-px bg-border" />
        </div>

        <button
          onClick={handleGoogle}
          className="w-full rounded-2xl bg-surface ring-1 ring-border py-3.5 text-sm font-medium hover:bg-accent"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
          <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-brand-ink font-medium underline-offset-4 hover:underline">
            {mode === "signin" ? "Create one" : "Sign in"}
          </button>
        </p>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          <Link to="/">Skip</Link>
        </p>
      </div>
    </div>
  );
}
