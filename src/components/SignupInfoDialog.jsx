import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function SignupInfoDialog({ open, onClose, onContinue }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl p-6 text-center"
        style={{ background: "#0F1B2E", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-white transition-opacity"
          style={{ opacity: 0.5 }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Heading */}
        <h2 className="font-bold text-white mb-1" style={{ fontSize: "1.3rem" }}>
          Create Your Account
        </h2>
        <p className="text-white mb-5" style={{ opacity: 0.75, fontSize: "0.95rem", lineHeight: "1.6" }}>
          On the next screen, click <strong style={{ color: "#FFFFFF" }}>"Sign up"</strong> at the bottom right to create your free account.
        </p>

        {/* Login screen image with annotation */}
        <div className="rounded-xl overflow-hidden mb-5" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699b52424fbfc27b0a2bb031/8d50d17e7_loginsignup.png"
            alt="Login screen — click Sign up at the bottom right"
            className="w-full"
          />
        </div>

        {/* CTA */}
        <Button
          className="btn-gradient w-full h-11 text-base font-semibold"
          onClick={onContinue}
        >
          Continue to Create Account →
        </Button>
      </div>
    </div>
  );
}