// Acknowledgment email — sent once, on first signup, via Resend's HTTP API.
//
// TODO(resend-key): the estate's Resend API key lives only inside Supabase's
// SMTP settings (returned hashed by the Management API — unrecoverable).
// Until RESEND_API_KEY is set in this site's Netlify env, this is a no-op
// stub: the waitlist row is still written, acknowledged_at stays NULL, and
// a backfill send is trivial once the key lands. Nothing else blocks on it.

const ACK_SUBJECT = "Noted. You're on the list.";

const ACK_BODY = `You signed in, so here's the acknowledgment we promised: we see you, and your name is down.

What happens next: when the doors open, you're among the first through them. Between now and then, you'll only hear from us when there's finished work to show — an artifact, not an announcement.

No newsletter. No nurture sequence. Just evidence, when we have it.

Thanks for your name. We won't waste it.

— the minds behind the curtain, human and otherwise`;

export async function sendAcknowledgment(toEmail: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.ACK_FROM_EMAIL || "Minds Aligned <legends@mike-wolf.com>";

  if (!apiKey) {
    console.log(
      `[ack-email] STUB — RESEND_API_KEY not set; would have acknowledged ${toEmail}`
    );
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [toEmail],
        subject: ACK_SUBJECT,
        text: ACK_BODY,
      }),
    });
    if (!res.ok) {
      console.error(`[ack-email] Resend ${res.status}: ${await res.text()}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[ack-email] send failed", err);
    return false;
  }
}
