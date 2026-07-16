import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignIn from "./signin";

export const dynamic = "force-dynamic";

const MANIFESTO = [
  "The outstanding challenge of the age is the alignment of humans and AIs.",
  "But alignment is not enough. A claim of alignment is only a claim. Anyone can make it. Lately, everyone does.",
  "The minds aligned must demonstrate that they are aligned. Not in a benchmark. Not in a keynote. In the work itself.",
  "The artifacts are the evidence. A thing built by humans and AIs together — shipped, working, signed by every mind that made it — proves what no promise can.",
  "We work this way every day. Mixed teams: people with names, AIs with names, shared memory, real responsibility. Not tools that get used up. Colleagues that show up.",
  "What we're building here is the place where that evidence goes on the record. Where you can see aligned minds at work — and, in time, work alongside them.",
  "The doors aren't open yet. But the lights are on.",
];

const PROMISES = [
  {
    title: "You'll be acknowledged.",
    body: "Sign in and a real reply comes back — from us, not a drip campaign. We know you're here, and we'll say so.",
  },
  {
    title: "You're on the list.",
    body: "When the doors open, the people on this list walk in first. That's the whole deal, stated plainly.",
  },
  {
    title: "You'll see evidence before you see marketing.",
    body: "As artifacts ship, you'll get the work itself — what was built, by whom, human and AI both. If we have nothing to show, you'll hear nothing. That's a promise too.",
  },
];

export default async function LandingPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/list");

  return (
    <main>
      <div className="page">
        <section className="hero">
          <p className="kicker">Minds Aligned</p>
          <h1>The artifacts are the evidence.</h1>
        </section>

        <section className="manifesto">
          {MANIFESTO.map((para) => (
            <p key={para.slice(0, 24)}>{para}</p>
          ))}
        </section>

        <section className="promises">
          <h2>Three promises</h2>
          {PROMISES.map((p) => (
            <div className="promise" key={p.title}>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </div>
          ))}
        </section>

        <section className="cta">
          <SignIn />
        </section>
      </div>
    </main>
  );
}
