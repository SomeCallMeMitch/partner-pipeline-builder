import React from "react";
import { Button } from "@/components/ui/button";
import { X, Sparkles } from "lucide-react";

export default function SignupInfoDialog({ open, onClose, onLogin, onSignup }) {
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

        {/* Icon */}
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(59,130,246,0.15)" }}>
          <Sparkles className="w-6 h-6 text-blue-400" />
        </div>

        {/* Heading */}
        <h2 className="font-bold text-white mb-1" style={{ fontSize: "1.3rem" }}>
          It's 100% Free
        </h2>
        <p className="text-white mb-5" style={{ opacity: 0.75, fontSize: "0.95rem", lineHeight: "1.6" }}>
          Create a free account to build and save your Partner Blueprint. No credit card needed — ever.
        </p>

        {/* Login screen image */}
        <div className="rounded-xl overflow-hidden mb-5" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699b52424fbfc27b0a2bb031/8d50d17e7_loginsignup.png"
            alt="Login screen — click Sign up at the bottom right"
            className="w-full"
          />
        </div>

        <p className="text-white mb-4" style={{ opacity: 0.6, fontSize: "0.85rem" }}>
          On the next screen, choose <strong style={{ color: "#fff", opacity: 1 }}>Sign up with Google</strong> or click <strong style={{ color: "#fff", opacity: 1 }}>"Sign up"</strong> at the bottom to use email.
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-2">
          <Button
            className="btn-gradient w-full h-11 text-base font-semibold"
            onClick={onSignup}
          >
            Sign Up — It's Free →
          </Button>
          <Button
            variant="ghost"
            className="w-full h-10 text-sm text-white"
            style={{ opacity: 0.7 }}
            onClick={onLogin}
          >
            Already have an account? Log In
          </Button>
        </div>
      </div>
    </div>
  );
}