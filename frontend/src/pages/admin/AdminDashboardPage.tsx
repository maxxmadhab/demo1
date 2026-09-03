import { useAuth } from "@/hooks/useAuth";

export default function AdminDashboardPage() {
  const { user, profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-ivory-deep">
      <header className="border-b border-charcoal/10 bg-white">
        <div className="container-jwel flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-display text-xl font-medium text-charcoal">Admin Dashboard</h1>
            <span className="hidden border border-gold/30 px-2 py-0.5 font-body text-[0.6rem] font-medium uppercase tracking-[0.2em] text-gold-deep sm:inline-block">
              Budhram
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden font-body text-sm text-stone sm:inline">
              {profile?.full_name || user?.email}
            </span>
            <button
              type="button"
              onClick={signOut}
              className="border border-charcoal/15 px-4 py-2 font-body text-[0.68rem] font-medium uppercase tracking-[0.12em] text-charcoal transition-colors duration-300 hover:border-charcoal hover:bg-charcoal hover:text-ivory"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="container-jwel py-12">
        <h2 className="mb-2 font-display text-2xl font-medium text-charcoal">
          Welcome, {profile?.full_name || "Admin"}
        </h2>
        <p className="mb-10 font-body text-sm text-stone">
          Manage your jewelry catalog, orders, and store settings.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Products", desc: "Manage your jewelry catalog" },
            { title: "Orders", desc: "View and process orders" },
            { title: "Customers", desc: "View customer accounts" },
            { title: "Collections", desc: "Organize product collections" },
            { title: "Settings", desc: "Store configuration" },
            { title: "Analytics", desc: "Sales and traffic data" },
          ].map((card) => (
            <div
              key={card.title}
              className="border border-charcoal/10 bg-white p-6 transition-shadow duration-300 hover:shadow-card"
            >
              <h3 className="mb-1 font-display text-lg font-medium text-charcoal">
                {card.title}
              </h3>
              <p className="font-body text-sm text-stone">{card.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
