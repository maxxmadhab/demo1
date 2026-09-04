import { NavLink, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/utils/cn";

const NAV = [
  { label: "Dashboard", to: "/admin", end: true, icon: "user" as const },
  { label: "Products", to: "/admin/products", end: false, icon: "bag" as const },
];

export function AdminSidebar() {
  const { profile, signOut } = useAuth();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-charcoal/10 bg-white lg:flex">
      <div className="flex h-16 items-center border-b border-charcoal/10 px-5">
        <Logo compact />
        <span className="ml-2 font-body text-[0.6rem] font-medium uppercase tracking-[0.2em] text-gold-deep">
          Admin
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-3" aria-label="Admin">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded px-3 py-2.5 font-body text-[0.78rem] font-medium text-stone transition-colors duration-200",
                isActive
                  ? "bg-charcoal text-ivory"
                  : "hover:bg-sand hover:text-charcoal"
              )
            }
          >
            <Icon name={item.icon} size={16} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t border-charcoal/10 p-3">
        <p className="px-3 pb-1 font-body text-[0.6rem] font-medium uppercase tracking-[0.18em] text-stone">
          {profile?.full_name || profile?.email || "Admin"}
        </p>
        <Link
          to="/"
          className="flex items-center gap-3 rounded px-3 py-2.5 font-body text-[0.78rem] font-medium text-stone transition-colors duration-200 hover:bg-sand hover:text-charcoal"
        >
          <Icon name="eye" size={16} />
          View store
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded px-3 py-2.5 font-body text-[0.78rem] font-medium text-stone transition-colors duration-200 hover:bg-sand hover:text-charcoal"
        >
          <Icon name="logout" size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
