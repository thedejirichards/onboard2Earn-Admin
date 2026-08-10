import { useNavigate } from "react-router";
import DesktopAuthLayout from "../components/DesktopAuthLayout";

function MicrosoftLogo() {
  return (
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
    </svg>
  );
}

export default function LoginStartPage() {
  const navigate = useNavigate();

  return (
    <DesktopAuthLayout>
      <div className="w-full max-w-[420px]">
        <div className="lg:hidden flex justify-center mb-8">
          <img src="/Onboard2EarnLogo.svg" alt="Onboard2Earn" className="w-40 h-auto" />
        </div>

        <div className="bg-white rounded-lg shadow-[0_2px_16px_rgba(0,0,0,0.12)] px-8 py-10">
          <h1 className="text-2xl font-bold text-[#1b1b1b] mb-2">Admin sign in</h1>
          <p className="text-sm text-[#5e5e5e] mb-8">
            Sign in with your Access Bank Entra ID account to manage staff onboarding.
          </p>

          <button
            onClick={() => navigate("/login/entra")}
            className="w-full flex items-center justify-center gap-3 border border-[#8c8c8c] hover:bg-[#f5f5f5] transition-colors rounded-sm py-3 px-4"
          >
            <MicrosoftLogo />
            <span className="text-[15px] text-[#1b1b1b] font-medium">Continue with Microsoft Entra ID</span>
          </button>
        </div>

        <p className="text-center text-xs text-[#8c8c8c] mt-6">
          Restricted access. For Access Bank staff only.
        </p>
      </div>
    </DesktopAuthLayout>
  );
}
