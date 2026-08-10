import { ReactNode } from "react";

interface DesktopAuthLayoutProps {
  children: ReactNode;
}

// Full-viewport split layout for the admin login flow:
// a branded panel on the left (hidden below lg) and the auth card on the right.
export default function DesktopAuthLayout({ children }: DesktopAuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex bg-[#f5f7f8]">
      <div
        className="hidden lg:flex lg:w-[42%] relative flex-col justify-between bg-cover bg-center p-12 text-white"
        style={{ backgroundImage: "url(/coverImage.jpg)" }}
      >
        <div className="absolute inset-0 bg-[#5584CE]/85" />
        <div className="relative">
          <img src="/AccessLogo.svg" alt="Access Bank" className="h-8 w-auto" />
        </div>
        <div className="relative">
          <img src="/Onboard2EarnLogo.svg" alt="Onboard2Earn" className="w-40 h-auto mb-6" />
          <h2 className="text-2xl font-bold leading-snug mb-3">
            Admin Console
          </h2>
          <p className="text-white/80 text-sm leading-relaxed max-w-sm">
            Manage staff onboarding, review customer applications, and track referral rewards
            across every branch from one place.
          </p>
        </div>
        <div className="relative text-white/60 text-xs">
          &copy; {new Date().getFullYear()} Access Bank Plc. All rights reserved.
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        {children}
      </div>
    </div>
  );
}
