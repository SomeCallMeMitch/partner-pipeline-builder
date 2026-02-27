import React from "react";
import { ThemeProvider } from "@/components/ThemeContext";

export default function Layout({ children, currentPageName }) {
  return (
    <ThemeProvider>
      <style>{`
        :root,
        .theme-nurturink {
          --ni-navy:        #1B2A4A;
          --ni-navy-light:  #243659;
          --ni-gold:        #C9973A;
          --ni-gold-light:  #E8B55A;
          --ni-cream:       #FAF8F4;
          --ni-cream-dark:  #F0EBE1;
          --ni-text:        #1A1A2E;
          --ni-muted:       #5A6278;
          --ni-white:       #FFFFFF;
          --ni-border:      #DDD5C5;
          --ni-success:     #2D6A4F;
          --ni-error:       #DC2626;
        }

        .theme-coastal {
          --ni-navy:        #1A3A5C;
          --ni-navy-light:  #1E4A72;
          --ni-gold:        #2E9E8F;
          --ni-gold-light:  #40BFB0;
          --ni-cream:       #F4F8FA;
          --ni-cream-dark:  #E8F0F5;
          --ni-text:        #0F2030;
          --ni-muted:       #4A6070;
          --ni-white:       #FFFFFF;
          --ni-border:      #C5D5DF;
          --ni-success:     #2D7A4F;
          --ni-error:       #DC2626;
        }

        .theme-charcoal {
          --ni-navy:        #2C2C2C;
          --ni-navy-light:  #3A3A3A;
          --ni-gold:        #C0392B;
          --ni-gold-light:  #E74C3C;
          --ni-cream:       #F7F7F5;
          --ni-cream-dark:  #EEEEE9;
          --ni-text:        #1A1A1A;
          --ni-muted:       #666666;
          --ni-white:       #FFFFFF;
          --ni-border:      #DCDCDC;
          --ni-success:     #2D6A4F;
          --ni-error:       #DC2626;
        }
      `}</style>

      {currentPageName === "Landing"
        ? <>{children}</>
        : (
          <div style={{ backgroundColor: "#0A0A12", minHeight: "100vh", color: "#F1F5F9" }}>
            <main>{children}</main>
          </div>
        )
      }
    </ThemeProvider>
  );
}