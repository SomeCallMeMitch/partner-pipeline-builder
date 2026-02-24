import React from "react";

export default function Layout({ children, currentPageName }) {
  // Landing page has its own full layout — no wrapper needed
  if (currentPageName === "Landing") {
    return <>{children}</>;
  }

  // For any other pages (Dashboard, Wizard, Output, etc.) — keep the old layout
  return (
    <div style={{ backgroundColor: "#0A0A12", minHeight: "100vh", color: "#F1F5F9" }}>
      <main>{children}</main>
    </div>
  );
}