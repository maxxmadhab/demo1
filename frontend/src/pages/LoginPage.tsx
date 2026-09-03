import { useState, type FormEvent } from "react";
import { Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";

export default function LoginPage() {
  const { signIn, signInWithGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      navigate(from, { replace: true });
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    await signInWithGoogle();
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-5">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <Logo />
        </div>

        <h1 className="mb-1 text-center font-display text-3xl font-medium text-charcoal">
          Welcome Back
        </h1>
        <p className="mb-8 text-center font-body text-sm text-stone">
          Sign in to your account
        </p>

        {error && (
          <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
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
          />

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="font-body text-[0.68rem] font-medium uppercase tracking-[0.12em] text-gold-deep transition-colors hover:text-gold"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-charcoal py-3.5 font-body text-[0.72rem] font-medium uppercase tracking-[0.14em] text-ivory transition-colors duration-300 hover:bg-charcoal-light disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-charcoal/10" />
          <span className="font-body text-[0.68rem] uppercase tracking-[0.15em] text-mist">
            or
          </span>
          <div className="h-px flex-1 bg-charcoal/10" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 border border-charcoal/15 bg-white py-3.5 font-body text-[0.72rem] font-medium uppercase tracking-[0.14em] text-charcoal transition-colors duration-300 hover:border-charcoal/30 disabled:opacity-50"
        >
          <Icon name="search" size={16} />
          Continue with Google
        </button>

        <p className="mt-8 text-center font-body text-sm text-stone">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-charcoal transition-colors hover:text-gold-deep"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
