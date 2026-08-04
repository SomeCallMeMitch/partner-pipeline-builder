import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import TrackerStyles, { C } from "@/components/tracker/TrackerStyles";
import NamingStep from "@/components/tracker/NamingStep";
import PartnerCard from "@/components/tracker/PartnerCard";
import { sortPartners, stageChangePatch } from "@/components/tracker/nextAction";

export default function Tracker() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const trackerIdParam = params.get("trackerId") || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tracker, setTracker] = useState(null);
  const [partners, setPartners] = useState([]);
  const [busy, setBusy] = useState(false);
  const [forceList, setForceList] = useState(false);

  // ── Load ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    (async () => {
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
        const user = await base44.auth.me();
        let t = null;

        if (trackerIdParam) {
          const found = await base44.entities.TrackerBlueprint.filter({ id: trackerIdParam }, "-created_date", 1);
          t = found && found[0];
        }
        if (!t) {
          const mine = await base44.entities.TrackerBlueprint.filter({ ownerUserId: user.id }, "-created_date", 1);
          t = mine && mine[0];
        }

        if (cancelled) return;

        if (!t) {
          setTracker(null);
          setLoading(false);
          return;
        }

        const list = await base44.entities.Partner.filter({ trackerId: t.id }, "rank", 50);
        if (cancelled) return;

        setTracker(t);
        setPartners((list || []).filter(p => !p.archived));
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        setError(err?.message || "Could not load your tracker.");
        setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [trackerIdParam]);

  // ── Write ─────────────────────────────────────────────────────────────────
  const patchPartner = useCallback(async (id, patch) => {
    setBusy(true);
    setPartners(prev => prev.map(p => (p.id === id ? { ...p, ...patch } : p)));
    try {
      await base44.entities.Partner.update(id, patch);
    } catch (err) {
      setError("That change did not save. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }, []);

  const saveNaming = useCallback(async (drafts) => {
    setBusy(true);
    const now = new Date().toISOString();
    const updated = [];

    for (const p of partners) {
      const d = drafts[p.id];
      if (!d) continue;
      const patch = {};
      if (d.partnerType && d.partnerType !== p.partnerType) patch.partnerType = d.partnerType.trim();
      if (d.company !== (p.company || "")) patch.company = d.company.trim();
      if (d.personName !== (p.personName || "")) patch.personName = d.personName.trim();
      if (d.personName.trim() && p.stage === "identified") {
        Object.assign(patch, stageChangePatch("named", now));
      }
      if (Object.keys(patch).length === 0) {
        updated.push(p);
        continue;
      }
      try {
        await base44.entities.Partner.update(p.id, patch);
        updated.push({ ...p, ...patch });
      } catch (err) {
        updated.push(p);
      }
    }

    try {
      await base44.entities.TrackerBlueprint.update(tracker.id, { namingComplete: true });
    } catch (err) {
      // Non-fatal: the list still renders, the naming step just reappears next visit.
    }

    setPartners(updated);
    setTracker(prev => ({ ...prev, namingComplete: true }));
    setBusy(false);
  }, [partners, tracker]);

  const ordered = useMemo(() => sortPartners(partners), [partners]);
  const dueCount = ordered.filter(x => x.a.isDue).length;
  const namedCount = partners.filter(p => (p.personName || "").trim()).length;

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="tk-wrap">
        <TrackerStyles />
        <div className="tk-main" style={{ paddingTop: 80, textAlign: "center", color: C.muted }}>Loading...</div>
      </div>
    );
  }

  if (!tracker) {
    return (
      <div className="tk-wrap">
        <TrackerStyles />
        <div className="tk-main" style={{ paddingTop: 60 }}>
          <div className="tk-card">
            <div className="tk-eyebrow">Nothing here yet</div>
            <div style={{ fontSize: 19, fontWeight: 800, color: C.navy, margin: "8px 0 10px" }}>
              You have not built a blueprint yet
            </div>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, marginBottom: 16 }}>
              The tracker is built from your Dream Partner Blueprint. Build one first, it takes about four minutes
              and costs nothing.
            </p>
            <button className="tk-btn tk-btn-primary" onClick={() => navigate("/")}>Build my blueprint</button>
          </div>
        </div>
      </div>
    );
  }

  const showNaming = !tracker.namingComplete && !forceList;
  const needsTypes = tracker.parseQuality === "placeholder";

  return (
    <div className="tk-wrap">
      <TrackerStyles />

      <div className="tk-nav">
        <div className="tk-nav-inner">
          <div>
            <div className="tk-nav-title">Partner Tracker</div>
            <div className="tk-nav-sub">
              {tracker.niche ? tracker.niche : "Referral partners"}
              {tracker.geography ? ` · ${tracker.geography}` : ""}
            </div>
          </div>
          <button
            className="tk-btn tk-btn-ghost"
            style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)" }}
            onClick={() => navigate(`/RunBlueprint?jobId=${tracker.jobId}`)}
          >
            My blueprint
          </button>
        </div>
      </div>

      <div className="tk-main">
        {error && (
          <div className="tk-card" style={{ borderColor: C.error, background: "#FEF2F2" }}>
            <div style={{ fontSize: 13, color: "#B91C1C" }}>{error}</div>
          </div>
        )}

        {showNaming ? (
          <NamingStep
            partners={partners}
            needsTypes={needsTypes}
            saving={busy}
            onSave={saveNaming}
            onSkip={() => setForceList(true)}
          />
        ) : (
          <>
            <div className="tk-card" style={{ background: C.navy, border: "none" }}>
              <div className="tk-eyebrow" style={{ color: C.goldLight }}>This week</div>
              <div style={{ color: C.white, fontWeight: 800, fontSize: 20, lineHeight: 1.35, margin: "8px 0 6px" }}>
                {dueCount === 0
                  ? "Nothing needs you right now"
                  : dueCount === 1
                    ? "One partner is waiting on you"
                    : `${dueCount} partners are waiting on you`}
              </div>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                {dueCount === 0
                  ? "Everything is on schedule. Come back when something comes due, or add a note about anything that happened."
                  : "One action each. Do what you can, leave the rest. Nothing here expires."}
              </p>
              {namedCount < partners.length && (
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 10, marginBottom: 0 }}>
                  {namedCount} of {partners.length} partners have a real name on them.
                </p>
              )}
            </div>

            {ordered.map(({ p, a }) => (
              <PartnerCard key={p.id} partner={p} action={a} onPatch={patchPartner} busy={busy} />
            ))}

            <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: C.muted, lineHeight: 1.7 }}>
              This is a checklist with a memory, not a CRM.<br />
              A few relationships done properly beat a hundred names in a spreadsheet.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
