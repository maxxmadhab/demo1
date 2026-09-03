import { useState, useEffect, type FormEvent } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [validToken, setValidToken] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (accessToken && refreshToken) {
      supabase.auth
        .setSession({ access_token: accessToken, refresh_token: refreshToken })
        .then(({ error }) => {
          if (error) {
            setError("Invalid or expired reset link. Please request a new one.");
          } else {
            setValidToken(true);
          }
          setVerifying(false);
          window.history.replaceState({}, "", window.location.pathname);
        });
    } else {
      setError("Invalid reset link. Please request a new one from the forgot password page.");
      setVerifying(false);
    }
  }, [searchParams]);

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
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError("Failed to update password. Please try again.");
    } else {
      setSuccess(true);
    }
  };

  if (verifying) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory">
        <Logo />
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory px-5">
        <div className="w-full max-w-md text-center">
          <Logo />
          <h1 className="mb-4 mt-10 font-display text-3xl font-medium text-charcoal">
            Password Updated
          </h1>
          <p className="mb-8 font-body text-sm leading-relaxed text-stone">
            Your password has been successfully reset. You can now sign in with your new password.
          </p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="inline-block bg-charcoal px-8 py-3.5 font-body text-[0.72rem] font-medium uppercase tracking-[0.14em] text-ivory transition-colors duration-300 hover:bg-charcoal-light"
          >
            Sign In
          </button>
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
          New Password
        </h1>
        <p className="mb-8 text-center font-body text-sm text-stone">
          Enter your new password below
        </p>

        {error && (
          <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-600">
            {error}
          </div>
        )}

        {validToken ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="New Password"
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
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <Link
              to="/forgot-password"
              className="inline-block bg-charcoal px-8 py-3.5 font-body text-[0.72rem] font-medium uppercase tracking-[0.14em] text-ivory transition-colors duration-300 hover:bg-charcoal-light"
            >
              Request New Link
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
