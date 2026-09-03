import { useState, type FormEvent } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";

export default function SignupPage() {
  const { signUp, signInWithGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const result = await signUp(email, password, fullName);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    await signInWithGoogle();
    setLoading(false);
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory px-5">
        <div className="w-full max-w-md text-center">
          <Logo />
          <h1 className="mb-4 mt-10 font-display text-3xl font-medium text-charcoal">
            Check Your Email
          </h1>
          <p className="mb-8 font-body text-sm leading-relaxed text-stone">
            We&apos;ve sent a verification link to <strong className="text-charcoal">{email}</strong>.
            Please check your inbox and follow the instructions to activate your account.
          </p>
          <Link
            to="/login"
            className="inline-block bg-charcoal px-8 py-3.5 font-body text-[0.72rem] font-medium uppercase tracking-[0.14em] text-ivory transition-colors duration-300 hover:bg-charcoal-light"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <Logo />
        </div>

        <h1 className="mb-1 text-center font-display text-3xl font-medium text-charcoal">
          Create Account
        </h1>
        <p className="mb-8 text-center font-body text-sm text-stone">
          Join the world of Budhram
        </p>

        {error && (
          <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Full Name"
            type="text"
            name="fullName"
            placeholder="Your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            autoComplete="name"
          />
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
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-charcoal py-3.5 font-body text-[0.72rem] font-medium uppercase tracking-[0.14em] text-ivory transition-colors duration-300 hover:bg-charcoal-light disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
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
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-charcoal transition-colors hover:text-gold-deep"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
