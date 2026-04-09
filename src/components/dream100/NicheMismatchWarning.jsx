import React from "react";

export default function NicheMismatchWarning({ message, onGoBack, onContinue }) {
  return (
    <div style={{
      background: '#FFFBEB',
      border: '1px solid #FCD34D',
      borderRadius: 10,
      padding: '14px 16px',
      marginBottom: 8,
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#92400E', marginBottom: 6 }}>
        Heads up — possible niche mismatch
      </div>
      <div style={{ fontSize: 13, color: '#78350F', lineHeight: 1.6, marginBottom: 12 }}>
        {message}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={onGoBack}
          style={{
            fontSize: 13, fontWeight: 600, padding: '7px 14px',
            background: '#FEF3C7', border: '1px solid #F59E0B',
            borderRadius: 7, cursor: 'pointer', color: '#92400E',
            fontFamily: "'Sora', sans-serif",
          }}
        >
          Go back and fix my niche
        </button>
        <button
          onClick={onContinue}
          style={{
            fontSize: 13, fontWeight: 600, padding: '7px 14px',
            background: 'transparent', border: '1px solid #D1D5DB',
            borderRadius: 7, cursor: 'pointer', color: '#6B7280',
            fontFamily: "'Sora', sans-serif",
          }}
        >
          Continue anyway
        </button>
      </div>
    </div>
  );
}