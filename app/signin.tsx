"use client";

import { FormEvent, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Phase = "idle" | "open" | "sending" | "sent";

export default function SignIn() {
  const supabase = useMemo(() => createClient(), []);
  const [phase, setPhase] = useState<Phase>("idle");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  async function sendMagicLink(e: FormEvent) {
    e.preventDefault();
    if (!supabase) {
      setError("Sign-in isn't configured on this deployment yet.");
      return;
    }
    setError("");
    setPhase("sending");
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { site_name: "Minds Aligned" },
      },
    });
    if (err) {
      setError(err.message);
      setPhase("open");
      return;
    }
    setPhase("sent");
  }

  async function signInWithGoogle() {
    if (!supabase) {
      setError("Sign-in isn't configured on this deployment yet.");
      return;
    }
    setError("");
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (err) setError(err.message);
  }

  if (phase === "idle") {
    return (
      <div>
        <button className="btn" onClick={() => setPhase("open")}>
          Put my name down
        </button>
        <p className="cta-support">
          One email. We write back once — then only when there&rsquo;s
          something worth showing.
        </p>
      </div>
    );
  }

  if (phase === "sent") {
    return (
      <div className="signin-panel">
        <p className="signin-sent">
          Check your email. The link inside puts your name down.
        </p>
      </div>
    );
  }

  return (
    <div>
      <form className="signin-panel" onSubmit={sendMagicLink}>
        <label htmlFor="email">Your email</label>
        <input
          id="email"
          type="email"
          required
          autoFocus
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="signin-row">
          <button className="btn" type="submit" disabled={phase === "sending"}>
            {phase === "sending" ? "Sending…" : "Send me the link"}
          </button>
          <button
            className="btn btn-quiet"
            type="button"
            onClick={signInWithGoogle}
          >
            Continue with Google
          </button>
        </div>
        {error ? <p className="signin-error">{error}</p> : null}
        <p className="signin-note">
          One email. We write back once — then only when there&rsquo;s
          something worth showing.
        </p>
      </form>
    </div>
  );
}
