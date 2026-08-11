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
        className="hidden lg:flex lg:w-[42%] relative flex-col justify-end h-auto bg-cover bg-center p-12 text-white overflow-hidden"
        style={{ backgroundImage: "url(/coverImage.jpg)" }}
      >
        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

        <div className="relative">
          <img src="/Onboard2EarnLogo-admin.svg" alt="Onboard2Earn" className="w-80 h-auto mb-6" />
          {/* <h2 className="text-2xl font-bold leading-snug mb-3">
            Admin Console
          </h2> */}
          <p className="text-white/80 text-sm leading-relaxed max-w-sm">
            Manage staff onboarding, review customer applications, and track referral rewards
            across every branch from one place.
          </p>
        </div>
        <div className="relative text-white/60 text-xs mt-8">
          &copy; {new Date().getFullYear()} Access Bank Plc. All rights reserved.
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        {children}
      </div>
    </div>
  );
}
