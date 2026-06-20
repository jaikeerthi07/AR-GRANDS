import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";

type State = "loading" | "ready" | "already" | "invalid" | "success" | "submitting" | "error";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<State>("loading");

  useEffect(() => {
    if (!token) {
      setState("invalid");
      return;
    }
    const validate = async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_ANON } }
        );
        const data = await res.json();
        if (data?.valid) setState("ready");
        else if (data?.reason === "already_unsubscribed") setState("already");
        else setState("invalid");
      } catch {
        setState("invalid");
      }
    };
    validate();
  }, [token]);

  const confirm = async () => {
    if (!token) return;
    setState("submitting");
    const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
      body: { token },
    });
    if (error) setState("error");
    else if (data?.success) setState("success");
    else if (data?.reason === "already_unsubscribed") setState("already");
    else setState("error");
  };

  return (
    <div className="pt-20 min-h-screen">
      <SEO title="Unsubscribe · A.R Grand Marriage Hall" description="Manage your email preferences." path="/unsubscribe" />
      <section className="section-padding max-w-xl mx-auto text-center">
        <h1 className="heading-xl text-foreground mb-6">Email Preferences</h1>

        {state === "loading" && <p className="text-body text-muted-foreground">Verifying your link…</p>}
        {state === "invalid" && <p className="text-body text-muted-foreground">This unsubscribe link is invalid or has expired.</p>}
        {state === "already" && <p className="text-body text-muted-foreground">You have already unsubscribed from these emails.</p>}
        {state === "ready" && (
          <>
            <p className="text-body text-muted-foreground mb-6">
              Click below to confirm you want to unsubscribe from A.R Grand emails.
            </p>
            <button
              onClick={confirm}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors"
            >
              Confirm Unsubscribe
            </button>
          </>
        )}
        {state === "submitting" && <p className="text-body text-muted-foreground">Processing…</p>}
        {state === "success" && <p className="text-body text-muted-foreground">You have been unsubscribed. Sorry to see you go.</p>}
        {state === "error" && <p className="text-body text-destructive">Something went wrong. Please try again later.</p>}
      </section>
    </div>
  );
};

export default Unsubscribe;
