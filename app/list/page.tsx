import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sendAcknowledgment } from "@/lib/acknowledge";
import SignOut from "./signout";

export const dynamic = "force-dynamic";

export default async function ListPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware gates this route too; this is the belt to its suspenders.
  if (!user || !user.email) redirect("/");

  // First authenticated visit: put their name down. RLS restricts the row
  // to the signed-in user; ignoreDuplicates makes repeat visits a no-op.
  const { data: inserted } = await supabase
    .from("ma_waitlist")
    .upsert(
      {
        email: user.email,
        user_id: user.id,
        source: "minds-aligned-door",
      },
      { onConflict: "user_id", ignoreDuplicates: true }
    )
    .select("id");

  // A returned row means this insert just happened — first signup.
  if (inserted && inserted.length > 0) {
    const sent = await sendAcknowledgment(user.email);
    if (sent) {
      await supabase
        .from("ma_waitlist")
        .update({ acknowledged_at: new Date().toISOString() })
        .eq("user_id", user.id);
    }
  }

  return (
    <main>
      <div className="page">
        <section className="noted">
          <h1>Noted. You&rsquo;re on the list.</h1>
          <p>
            <span className="your-email">{user.email}</span>
          </p>
          <p>
            When the doors open, you walk in first. Between now and then,
            you&rsquo;ll only hear from us when there&rsquo;s finished work to
            show — an artifact, not an announcement.
          </p>
          <div className="signout">
            <SignOut />
          </div>
        </section>
      </div>
    </main>
  );
}
