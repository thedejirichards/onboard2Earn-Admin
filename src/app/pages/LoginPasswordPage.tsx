import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import DesktopAuthLayout from "../components/DesktopAuthLayout";

export default function LoginPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email || "admin@accessbankplc.com";
  const [password, setPassword] = useState("");

  const signIn = () => {
    if (!password) return;
    navigate("/dashboard");
  };

  return (
    <DesktopAuthLayout>
      <div className="w-full max-w-[420px] bg-white rounded-lg shadow-[0_2px_16px_rgba(0,0,0,0.12)] overflow-hidden">
        <div className="px-8 pt-8 pb-7">
          <button
            onClick={() => navigate("/login/entra")}
            className="flex items-center gap-2.5 mb-5 text-[#5e5e5e] hover:opacity-80 transition-opacity"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#5e5e5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-['Segoe_UI',sans-serif] text-sm">{email}</span>
          </button>

          <h1 className="font-['Segoe_UI',sans-serif] font-semibold text-[26px] text-[#1b1b1b] mb-5">
            Enter password
          </h1>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && signIn()}
            placeholder="Password"
            autoFocus
            className="w-full border-0 border-b border-[#666] focus:border-b-2 focus:border-[#0067b8] outline-none font-['Segoe_UI',sans-serif] text-sm text-[#1b1b1b] placeholder-[#5e5e5e] py-2 mb-3.5 bg-transparent"
          />

          <button className="font-['Segoe_UI',sans-serif] text-sm text-[#0067b8] hover:underline">
            Forgot my password
          </button>

          <div className="flex justify-end mt-9">
            <button
              onClick={signIn}
              disabled={!password}
              className={`font-['Segoe_UI',sans-serif] font-medium text-[15px] px-7 py-2 rounded-sm transition-colors ${password ? "bg-[#0067b8] hover:bg-[#005a9e] text-white" : "bg-[#f3f2f1] text-[#a19f9d] cursor-not-allowed"}`}
            >
              Sign in
            </button>
          </div>
        </div>

        <div className="bg-[#f3f2f1] px-8 py-5">
          <p className="font-['Segoe_UI',sans-serif] font-semibold text-sm text-[#1b1b1b] mb-2">
            Access Bank Admin Console
          </p>
          <p className="font-['Segoe_UI',sans-serif] text-sm text-[#5e5e5e] leading-5">
            This is a restricted login. Please do not sign in if you are not authorized Access Bank staff.
          </p>
        </div>
      </div>
    </DesktopAuthLayout>
  );
}
