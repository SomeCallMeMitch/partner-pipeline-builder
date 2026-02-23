import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Plus, Download, Copy, Trash2, Edit2, MoreHorizontal, Loader2, FileText, RefreshCw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Dashboard() {
  const navigate = useNavigate();
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [renamingId, setRenamingId] = useState(null);
  const [renameVal, setRenameVal] = useState("");

  useEffect(() => {
      base44.auth.isAuthenticated().then(authed => {
                    if (!authed) base44.auth.redirectToLogin(createPageUrl("Landing"));
                  });
      loadBuilds();
    }, []);

  const loadBuilds = () => {
    base44.entities.Build.list("-created_date", 50).then(b => {
      setBuilds(b);
      setLoading(false);
    });
  };

  const handleDelete = async (id) => {
    await base44.entities.Build.delete(id);
    setBuilds(b => b.filter(x => x.id !== id));
  };

  const handleDuplicate = async (build) => {
    const copy = await base44.entities.Build.create({
      ...build,
      id: undefined,
      name: `${build.name} (Copy)`,
      created_date: undefined,
      updated_date: undefined,
    });
    setBuilds(b => [copy, ...b]);
  };

  const handleRename = async (id) => {
    await base44.entities.Build.update(id, { name: renameVal });
    setBuilds(b => b.map(x => x.id === id ? { ...x, name: renameVal } : x));
    setRenamingId(null);
  };

  const handleDownload = (build) => {
    const blob = new Blob([build.generated_output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${build.name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = (build) => {
    navigator.clipboard.writeText(build.generated_output);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0A0A12" }}>
      <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A0A12" }}>
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">My Builds</h1>
              <p className="text-slate-500 text-sm mt-0.5">{builds.length} blueprint{builds.length !== 1 ? "s" : ""} saved</p>
            </div>
        </div>

        {/* Empty state */}
        {builds.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: "rgba(99,102,241,0.1)" }}>
              <FileText className="w-7 h-7 text-indigo-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">No builds yet</h3>
            <p className="text-slate-500 text-sm mb-6">Generate your first Partner Pipeline Blueprint</p>
            <Button className="btn-gradient gap-2" onClick={() => navigate(createPageUrl("Wizard"))}>
              <Plus className="w-4 h-4" /> Create First Build
            </Button>
          </div>
        )}

        {/* Builds grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {builds.map(build => (
            <div key={build.id} className="card-surface rounded-2xl p-5 flex flex-col">
              {/* Name */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  {renamingId === build.id ? (
                    <div className="flex gap-1.5">
                      <input
                        value={renameVal}
                        onChange={e => setRenameVal(e.target.value)}
                        className="input-dark px-2 py-1 text-xs w-full"
                        style={{ borderRadius: 6 }}
                        autoFocus
                        onKeyDown={e => e.key === "Enter" && handleRename(build.id)}
                      />
                      <button
                        onClick={() => handleRename(build.id)}
                        className="text-indigo-400 hover:text-indigo-300 text-xs px-1.5"
                      >✓</button>
                    </div>
                  ) : (
                    <h3 className="font-semibold text-white text-sm leading-tight truncate pr-2">{build.name}</h3>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-300 h-7 w-7 flex-shrink-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <DropdownMenuItem
                      className="text-slate-300 hover:text-white text-xs cursor-pointer gap-2"
                      onClick={() => { setRenamingId(build.id); setRenameVal(build.name); }}
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-slate-300 hover:text-white text-xs cursor-pointer gap-2"
                      onClick={() => handleDuplicate(build)}
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-slate-300 hover:text-white text-xs cursor-pointer gap-2"
                      onClick={() => handleCopy(build)}
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy Output
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-slate-300 hover:text-white text-xs cursor-pointer gap-2"
                      onClick={() => handleDownload(build)}
                    >
                      <Download className="w-3.5 h-3.5" /> Download .md
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-400 hover:text-red-300 text-xs cursor-pointer gap-2"
                      onClick={() => handleDelete(build.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: "rgba(99,102,241,0.12)", color: "#818cf8" }}>{build.industry}</span>
                <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: "rgba(255,255,255,0.05)", color: "#64748b" }}>
                  {build.mode === "advanced" ? "Advanced" : "Simple"}
                </span>
                {build.model_selection && (
                  <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: "rgba(255,255,255,0.05)", color: "#64748b" }}>{build.model_selection}</span>
                )}
              </div>

              <div className="text-xs text-slate-600 mb-4">
                {build.niche && <p className="truncate">{build.niche}</p>}
                {build.geography && <p className="truncate">{build.geography}</p>}
              </div>

              <div className="text-xs text-slate-700 mb-4">
                {new Date(build.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs h-7 border-slate-600 hover:text-white"
                  style={{ color: "#94a3b8", backgroundColor: "transparent", borderColor: "rgba(255,255,255,0.2)" }}
                  onClick={() => navigate(createPageUrl(`Output?id=${build.id}`))}
                >
                  View
                </Button>
                <Button
                  size="sm"
                  className="flex-1 btn-gradient text-xs h-7"
                  onClick={() => handleDownload(build)}
                >
                  <Download className="w-3 h-3 mr-1" /> .md
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}