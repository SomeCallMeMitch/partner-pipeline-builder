import React from "react";

const LABELS = ['Choose Your Niche', 'Your Market', 'Your Info', 'Review & Generate'];

export default function StepBar({ currentStep, visible }) {
  if (!visible) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, flex: 1, justifyContent: 'center', padding: '0 24px' }}>
      {[1, 2, 3, 4].map((i) => (
        <React.Fragment key={i}>
          <div className={`d100-step-pip ${i < currentStep ? 'done' : ''} ${i === currentStep ? 'active' : ''}`}>
            {i < currentStep ? '✓' : i}
          </div>
          {i < 4 && (
            <div className={`d100-step-connector ${i < currentStep ? 'done' : ''}`} />
          )}
        </React.Fragment>
      ))}
      <div className="d100-step-label">
        <strong>Step {currentStep} of 4</strong> — {LABELS[currentStep - 1]}
      </div>
    </div>
  );
}