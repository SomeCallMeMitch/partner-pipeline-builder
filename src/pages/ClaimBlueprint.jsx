import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import TrackerStyles, { C } from "@/components/tracker/TrackerStyles";

export default function ClaimBlueprint() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const jobId = params.get("jobId") || "";
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("Setting up your tracker...");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!jobId) {
        setError("No blueprint was specified. Open your blueprint and try the button again.");
        return;
      }

      let authed = false;
      try {
        authed = await base44.auth.isAuthenticated();
      } catch (e) {
        authed = false;
      }

      if (!authed) {
        base44.auth.redirectToLogin(window.location.href);
        return;
      }

      try {
        const res = await base44.functions.invoke("claimBlueprint", { jobId });
        const data = res?.data || {};
        if (data.error) throw new Error(data.error);
        if (cancelled) return;
        setMessage("Ready.");
        navigate(`/Tracker?trackerId=${data.trackerId}`, { replace: true });
      } catch (err) {
        if (cancelled) return;
        setError(err?.message || "We could not set up your tracker. Try again in a moment.");
      }
    })();

    return () => { cancelled = true; };
  }, [jobId, navigate]);

  return (
    <div className="tk-wrap">
      <TrackerStyles />
      <div className="tk-main" style={{ paddingTop: 80, textAlign: "center" }}>
        {error ? (
          <div className="tk-card" style={{ textAlign: "left" }}>
            <div className="tk-eyebrow" style={{ color: C.error }}>Something went wrong</div>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: C.text, margin: "10px 0 16px" }}>{error}</p>
            <button className="tk-btn tk-btn-ghost" onClick={() => navigate(-1)}>Go back</button>
          </div>
        ) : (
          <>
            <div style={{
              width: 34, height: 34, margin: "0 auto 16px",
              border: `3px solid ${C.creamDark}`, borderTopColor: C.gold,
              borderRadius: "50%", animation: "tkspin 0.9s linear infinite",
            }} />
            <style>{`@keyframes tkspin { to { transform: rotate(360deg); } }`}</style>
            <div style={{ fontSize: 15, color: C.muted }}>{message}</div>
          </>
        )}
      </div>
    </div>
  );
}
