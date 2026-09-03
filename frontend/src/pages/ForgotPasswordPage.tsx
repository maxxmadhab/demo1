import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await resetPassword(email);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
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
            If an account exists for <strong className="text-charcoal">{email}</strong>,
            we&apos;ve sent a password reset link. Please check your inbox.
          </p>
          <Link
            to="/login"
            className="inline-block bg-charcoal px-8 py-3.5 font-body text-[0.72rem] font-medium uppercase tracking-[0.14em] text-ivory transition-colors duration-300 hover:bg-charcoal-light"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-5">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <Logo />
        </div>

        <h1 className="mb-1 text-center font-display text-3xl font-medium text-charcoal">
          Reset Password
        </h1>
        <p className="mb-8 text-center font-body text-sm text-stone">
          Enter your email and we&apos;ll send you a reset link
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-charcoal py-3.5 font-body text-[0.72rem] font-medium uppercase tracking-[0.14em] text-ivory transition-colors duration-300 hover:bg-charcoal-light disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-8 text-center font-body text-sm text-stone">
          Remember your password?{" "}
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
