import type { ReactNode } from "react";
import { Logo } from "@/components/landing/Logo";

// Shared shell for the pages the desktop app opens in the browser
// (connect, subscribe, subscribed): one centered card, nothing to navigate.
export default function DesktopLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream/40 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        {children}
      </div>
    </div>
  );
}
