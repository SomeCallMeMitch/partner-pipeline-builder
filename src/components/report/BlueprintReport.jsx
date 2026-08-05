import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Markdown from "@/utils/renderMarkdown";
import { parseDream5, matchNoteToPartner } from "@/utils/parseDream5";
import { parsePhase6Notes } from "@/utils/parsePhase6";

const C = {
  navy: "#1B2A4A", navyLight: "#243659", navyDeep: "#0F1B2E",
  gold: "#C9973A", goldLight: "#E8B55A",
  cream: "#FAF8F4", creamDark: "#F0EBE1",
  text: "#1A1A2E", muted: "#5A6278", border: "#DDD5C5", white: "#FFFFFF",
  warning: "#92400E", warningBg: "#FFFBEB", warningBorder: "#FCD34D",
};
const font = "'Sora', -apple-system, sans-serif";

// Human names for the phases. The agent should never see "Phase 3" -- they
// should see what the section gives them. Keyed by phase id.
const SECTION_NAMES = {
  1: { title: "When your clients start thinking about moving", sub: "The timeline behind every listing you want" },
  2: { title: "Everyone who touches your client before you do", sub: "Where the referrals actually come from" },
  3: { title: "Your five partner types, ranked", sub: "Who to build with, and why these five" },
  4: { title: "What you bring to each partner", sub: "Why they should care, in their language" },
  5: { title: "What they will push back on", sub: "The objections, and what to say" },
  6: { title: "Every message and note, written for you", sub: "Emails, scripts, and the handwritten notes" },
  7: { title: "Your first 90 days", sub: "Week by week, and the year that follows" },
};

function SectionCard({ phase, result, defaultOpen }) {
  const [open, setOpen] = useState(!!defaultOpen);
  const meta = SECTION_NAMES[phase.id] || { title: phase.title, sub: "" };
  if (!result) return null;

  return (
    <div style={{
      background: C.white, border: `1px solid ${C.border}`, borderRadius: 14,
      marginBottom: 12, overflow: "hidden",
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", textAlign: "left", background: open ? C.cream : C.white,
          border: "none", padding: "18px 22px", cursor: "pointer", fontFamily: font,
          display: "flex", alignItems: "center", gap: 14,
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: C.navy, lineHeight: 1.3 }}>{meta.title}</div>
          {meta.sub && <div style={{ fontSize: 13.5, color: C.muted, marginTop: 3 }}>{meta.sub}</div>}
        </div>
        <span style={{
          color: C.gold, fontSize: 15, fontWeight: 800, flexShrink: 0,
          transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s",
        }}>⌄</span>
      </button>
      {open && (
        <div style={{ padding: "4px 24px 24px", borderTop: `1px solid ${C.border}` }}>
          <Markdown text={result} />
        </div>
      )}
    </div>
  );
}

export default function BlueprintReport({
  phases, phaseResults, phaseWarnings, formData, jobId,
  onDownloadWord, onDownloadMarkdown, exportingWord,
}) {
  const navigate = useNavigate();

  const { rows } = useMemo(() => parseDream5(phaseResults), [phaseResults]);
  const notes = useMemo(() => parsePhase6Notes(phaseResults?.['6']) || [], [phaseResults]);

  const first = rows[0] || null;
  const firstNote = useMemo(
    () => (first ? matchNoteToPartner(first.partnerType, notes) : null),
    [first, notes]
  );

  const warningCount = Object.keys(phaseWarnings || {}).length;
  const agentName = (formData?.name || "").trim();
  const geo = (formData?.geo || "").trim();

  return (
    <div>
      {/* ── START HERE ─────────────────────────────────────────────────── */}
      <div style={{
        background: C.navy, borderRadius: 18, padding: "32px 36px", marginBottom: 18,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -50, right: -50, width: 220, height: 220,
          background: "radial-gradient(circle, rgba(201,151,58,0.14), transparent 65%)", pointerEvents: "none",
        }} />
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
          color: C.goldLight, marginBottom: 12, position: "relative",
        }}>
          Start here
        </div>
        <h1 style={{
          color: C.white, fontWeight: 800, fontSize: 28, lineHeight: 1.25,
          margin: "0 0 16px", position: "relative",
        }}>
          {agentName ? `${agentName}, here is` : "Here is"} the whole plan in one screen
        </h1>

        {rows.length > 0 ? (
          <>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16, lineHeight: 1.7, margin: "0 0 20px", maxWidth: 700, position: "relative" }}>
              These are the five kinds of professionals who see your clients before you do
              {geo ? ` in ${geo}` : ""}. Everything below this box is the detail behind them.
            </p>

            <div style={{ position: "relative", marginBottom: 22 }}>
              {rows.map((r, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 0",
                  borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
                }}>
                  <div style={{
                    flex: "0 0 26px", height: 26, borderRadius: "50%",
                    background: i === 0 ? C.gold : "rgba(255,255,255,0.12)",
                    color: i === 0 ? C.navy : "rgba(255,255,255,0.75)",
                    fontWeight: 800, fontSize: 13,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: C.white, fontSize: 15.5, fontWeight: 700, lineHeight: 1.4 }}>
                      {r.partnerType}
                      {i === 0 && (
                        <span style={{
                          marginLeft: 10, fontSize: 10, fontWeight: 800, letterSpacing: "0.06em",
                          textTransform: "uppercase", background: C.gold, color: C.navy,
                          padding: "3px 8px", borderRadius: 999, whiteSpace: "nowrap",
                        }}>Start with this one</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* The note, in full, for the first partner */}
            {firstNote?.noteText && (
              <div style={{
                position: "relative", background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14,
                padding: "20px 22px", marginBottom: 20,
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                  color: C.goldLight, marginBottom: 10,
                }}>
                  The note to send first, already written
                </div>
                <div style={{
                  color: C.white, fontSize: 16, lineHeight: 1.75, fontStyle: "italic",
                  borderLeft: `3px solid ${C.gold}`, paddingLeft: 16,
                }}>
                  {firstNote.noteText}
                </div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.6, marginTop: 12 }}>
                  Send this before any email or call. A note on someone's desk gets read. An
                  introduction email from an agent does not.
                </div>
              </div>
            )}
          </>
        ) : (
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16, lineHeight: 1.7, margin: "0 0 20px", maxWidth: 700, position: "relative" }}>
            Your full blueprint is below. Open any section to read it, or download the whole thing.
          </p>
        )}

        {/* The honest line: a report on its own does nothing */}
        <div style={{
          position: "relative", borderTop: "1px solid rgba(255,255,255,0.12)",
          paddingTop: 18, color: "rgba(255,255,255,0.72)", fontSize: 15, lineHeight: 1.7,
        }}>
          <strong style={{ color: C.white }}>One honest thing before you scroll.</strong> This is a good plan,
          and a good plan you do not act on is worth exactly nothing. The agents who get referral partners
          are not the ones with the best strategy. They are the ones who sent the first note. That is why
          the tracker below exists, and why it is free.
        </div>
      </div>

      {/* ── THE HANDOFF ────────────────────────────────────────────────── */}
      <div style={{
        background: "#FFFDF9", border: `1.5px solid ${C.goldLight}`, borderRadius: 16,
        padding: "26px 28px", marginBottom: 26,
      }}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
          color: C.gold, marginBottom: 10,
        }}>
          The next ten minutes
        </div>
        <div style={{ fontSize: 21, fontWeight: 800, color: C.navy, lineHeight: 1.3, marginBottom: 12 }}>
          Turn {rows.length > 0 ? `these ${rows.length} types` : "this plan"} into real people, and send one note
        </div>
        <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7, margin: "0 0 18px", maxWidth: 640 }}>
          A type cannot take your call. The tracker walks you through naming one real person, keeps the
          note that is already written for them, and tells you the single next step each week. Start with
          one partner. You can add the rest whenever you want.
        </p>
        <button
          onClick={() => navigate(`/ClaimBlueprint?jobId=${jobId}`)}
          style={{
            background: C.gold, color: C.navy, border: "none", borderRadius: 12,
            padding: "16px 30px", fontWeight: 800, fontSize: 17, fontFamily: font, cursor: "pointer",
          }}
        >
          Set up my tracker →
        </button>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 12, lineHeight: 1.6 }}>
          Free, and your report stays here either way.
        </div>
      </div>

      {/* ── WARNINGS (kept, but quiet) ─────────────────────────────────── */}
      {warningCount > 0 && (
        <div style={{
          background: C.warningBg, border: `1px solid ${C.warningBorder}`, borderRadius: 12,
          padding: "14px 18px", marginBottom: 18, fontSize: 13.5, color: C.warning, lineHeight: 1.6,
        }}>
          {warningCount} section{warningCount > 1 ? "s" : ""} may have come out incomplete. The report is
          still usable, but give {warningCount > 1 ? "those sections" : "that section"} a read before you rely on it.
        </div>
      )}

      {/* ── THE FULL REPORT ────────────────────────────────────────────── */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: C.navy, marginBottom: 4 }}>The full blueprint</div>
        <div style={{ fontSize: 14.5, color: C.muted, lineHeight: 1.6 }}>
          Open any section to read it. Nothing here expires, and you can come back to this page any time.
        </div>
      </div>

      {phases.map((phase, idx) => (
        <SectionCard
          key={phase.id}
          phase={phase}
          result={phaseResults[String(phase.id)]}
          defaultOpen={idx === 0}
        />
      ))}

      {/* ── DOWNLOADS AT THE BOTTOM TOO ────────────────────────────────── */}
      <div style={{
        background: C.white, border: `1px solid ${C.border}`, borderRadius: 14,
        padding: "22px 24px", marginTop: 20, textAlign: "center",
      }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: C.navy, marginBottom: 12 }}>
          Take the whole thing with you
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={onDownloadWord} disabled={exportingWord} style={{
            background: C.navy, color: C.white, border: "none", borderRadius: 10,
            padding: "12px 24px", fontWeight: 700, fontSize: 15, fontFamily: font,
            cursor: exportingWord ? "not-allowed" : "pointer",
          }}>
            {exportingWord ? "Building document..." : "Download Word doc"}
          </button>
          <button onClick={onDownloadMarkdown} style={{
            background: "transparent", border: `1.5px solid ${C.border}`, borderRadius: 10,
            padding: "12px 24px", fontWeight: 600, fontSize: 15, fontFamily: font,
            color: C.muted, cursor: "pointer",
          }}>
            Download Markdown
          </button>
        </div>
      </div>
    </div>
  );
}
