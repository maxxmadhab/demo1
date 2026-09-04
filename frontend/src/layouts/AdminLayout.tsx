import { Link, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";

export function AdminLayout() {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-sand/50">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-charcoal/10 bg-white px-4 lg:hidden">
        <Logo compact />
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex h-9 w-9 items-center justify-center rounded-full text-charcoal transition-colors hover:text-gold-deep"
            aria-label="View store"
          >
            <Icon name="eye" size={18} />
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="flex h-9 w-9 items-center justify-center rounded-full text-charcoal transition-colors hover:text-gold-deep"
            aria-label="Sign out"
          >
            <Icon name="logout" size={18} />
          </button>
        </div>
      </header>

      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="min-w-0 flex-1 lg:pl-60">
          <main className="min-h-screen">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
