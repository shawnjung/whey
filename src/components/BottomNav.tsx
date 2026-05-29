import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Home, ClipboardList, Users, User, Plus } from "lucide-react";

const tabs = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/logs", label: "Logs", icon: ClipboardList },
] as const;

const rightTabs = [
  { to: "/friends", label: "Friends", icon: Users },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-background/85 backdrop-blur-xl border-t border-border">
      <div className="max-w-md mx-auto flex justify-between items-center px-6 pt-3 pb-[max(env(safe-area-inset-bottom),1.5rem)]">
        {tabs.map((t) => {
          const active = pathname === t.to;
          const Icon = t.icon;
          return (
            <Link key={t.to} to={t.to} className={`flex flex-col items-center gap-1 ${active ? "text-brand-ink" : "text-muted-foreground"}`}>
              <Icon className="size-6" strokeWidth={active ? 2.4 : 1.8} />
              <span className="text-[10px] font-medium">{t.label}</span>
            </Link>
          );
        })}

        <div className="-mt-10">
          <button
            type="button"
            onClick={() => navigate({ to: "/add" })}
            className="size-16 rounded-full bg-foreground text-brand flex items-center justify-center shadow-2xl ring-4 ring-background transition-transform active:scale-95"
            aria-label="Add log"
          >
            <Plus className="size-8" strokeWidth={2.5} />
          </button>
        </div>

        {rightTabs.map((t) => {
          const active = pathname === t.to;
          const Icon = t.icon;
          return (
            <Link key={t.to} to={t.to} className={`flex flex-col items-center gap-1 ${active ? "text-brand-ink" : "text-muted-foreground"}`}>
              <Icon className="size-6" strokeWidth={active ? 2.4 : 1.8} />
              <span className="text-[10px] font-medium">{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
