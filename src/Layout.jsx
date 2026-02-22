import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Layers, LayoutDashboard, Plus, LogOut } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  return (
    <div style={{ backgroundColor: "#0A0A12", minHeight: "100vh", color: "#F1F5F9" }}>
      <style>{`
        * { box-sizing: border-box; }
        body { background-color: #0A0A12; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .gradient-text {
          background: linear-gradient(135deg, #818CF8 0%, #C084FC 50%, #F472B6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .btn-gradient {
          background: linear-gradient(135deg, #6366F1, #8B5CF6) !important;
          transition: all 0.2s !important;
          color: white !important;
          border: none !important;
        }
        .btn-gradient:hover {
          background: linear-gradient(135deg, #5558E8, #7C3AED) !important;
          transform: translateY(-1px);
        }
        .card-surface {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.2s;
        }
        .card-surface:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.14);
        }
        .card-selected {
          background: rgba(99, 102, 241, 0.12) !important;
          border-color: rgba(99, 102, 241, 0.5) !important;
        }
        .input-dark {
          background: rgba(255,255,255,0.04) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          color: #F1F5F9 !important;
          border-radius: 8px;
          transition: all 0.2s;
        }
        .input-dark:focus {
          border-color: rgba(99,102,241,0.6) !important;
          outline: none !important;
          background: rgba(255,255,255,0.06) !important;
        }
        .input-dark::placeholder { color: #475569 !important; }
        .scrollbar-dark::-webkit-scrollbar { width: 4px; }
        .scrollbar-dark::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-dark::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      {currentPageName !== "Landing" && (
        <nav style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", backgroundColor: "rgba(10,10,18,0.9)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
          <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
            <Link to={createPageUrl("Landing")} className="flex items-center gap-2.5 no-underline">
              <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center flex-shrink-0">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-white text-sm hidden sm:block">Partner Pipeline Builder</span>
            </Link>

            {user && (
              <div className="flex items-center gap-2">
                <Link to={createPageUrl("Dashboard")}>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white gap-1.5 h-8 px-3">
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-xs">My Builds</span>
                  </Button>
                </Link>
                <Link to={createPageUrl("Wizard")}>
                  <Button size="sm" className="btn-gradient gap-1.5 h-8 px-3 text-xs">
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">New Build</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-600 hover:text-red-400 h-8 w-8"
                  onClick={() => base44.auth.logout(createPageUrl("Landing"))}
                >
                  <LogOut className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </div>
        </nav>
      )}

      <main>{children}</main>
    </div>
  );
}