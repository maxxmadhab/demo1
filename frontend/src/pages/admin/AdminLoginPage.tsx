import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AuthConfigNotice } from "@/components/auth/AuthConfigNotice";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";

export default function AdminLoginPage() {
  const { signIn, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else if (!isAdmin) {
      setError("This account does not have admin access.");
      setPassword("");
    } else {
      navigate("/admin", { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal px-5">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <Logo />
        </div>

        <div className="mb-2 text-center">
          <span className="inline-block border border-gold/30 px-3 py-1 font-body text-[0.6rem] font-medium uppercase tracking-[0.25em] text-gold">
            Administration
          </span>
        </div>

        <h1 className="mb-1 text-center font-display text-3xl font-medium text-ivory">
          Admin Sign In
        </h1>
        <p className="mb-8 text-center font-body text-sm text-mist">
          Authorized personnel only
        </p>

        <div className="[&_div]:text-amber-200 [&_div]:bg-amber-950/40 [&_div]:border-amber-700/50 [&_code]:text-amber-100">
          <AuthConfigNotice />
        </div>

        {error && (
          <div className="mb-6 border border-red-400/30 bg-red-900/20 px-4 py-3 font-body text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="admin@budhram.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="border-white/10 bg-white/5 text-ivory placeholder:text-mist focus:border-gold"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="border-white/10 bg-white/5 text-ivory placeholder:text-mist focus:border-gold"
          />

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="font-body text-[0.68rem] font-medium uppercase tracking-[0.12em] text-gold transition-colors hover:text-gold-deep"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold-deep py-3.5 font-body text-[0.72rem] font-medium uppercase tracking-[0.14em] text-ivory transition-colors duration-300 hover:bg-gold disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-10 text-center font-body text-[0.68rem] text-mist">
          &copy; {new Date().getFullYear()} Budhram Fine Jewelry
        </p>
      </div>
    </div>
  );
}
