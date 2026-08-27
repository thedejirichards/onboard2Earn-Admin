import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import DesktopAuthLayout from "../components/DesktopAuthLayout";

export default function LoginTokenPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = (location.state as { username?: string } | null)?.username || "";
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const canSubmit = /^\d{6}$/.test(token);

  const verify = () => {
    if (!canSubmit) return;
    setError("");
    navigate("/dashboard");
  };

  return (
    <DesktopAuthLayout>
      <div className="w-full max-w-[420px] bg-white rounded-lg shadow-[0_2px_16px_rgba(0,0,0,0.12)] px-8 py-10">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 mb-5 text-[#667085] hover:opacity-80 transition-opacity"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {username && <span className="text-sm">{username}</span>}
        </button>

        <h1 className="text-2xl font-bold text-[#101828] mb-2">Two-factor verification</h1>
        <p className="text-sm text-[#667085] mb-8">
          Enter the 6-digit passcode currently shown on your Entrust token to complete sign in.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            verify();
          }}
        >
          <label className="block text-xs font-medium text-[#344054] mb-1.5" htmlFor="entrust-token">
            Entrust token code
          </label>
          <input
            id="entrust-token"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={token}
            onChange={(e) => setToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            autoFocus
            autoComplete="one-time-code"
            className="w-full border border-[#D0D5DD] focus:border-[#EE7E01] focus:ring-1 focus:ring-[#EE7E01] outline-none rounded-md text-lg tracking-[0.4em] text-center text-[#101828] placeholder-[#98A2B3] py-2.5 px-3 mb-2 transition-colors"
          />

          {error && <p className="text-xs text-[#D92D20] mb-2">{error}</p>}

          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full font-medium text-sm py-2.5 rounded-md transition-colors mt-4 ${
              canSubmit ? "bg-[#EE7E01] hover:bg-[#D66F00] text-white" : "bg-[#F2F4F7] text-[#98A2B3] cursor-not-allowed"
            }`}
          >
            Verify and sign in
          </button>
        </form>
      </div>
    </DesktopAuthLayout>
  );
}
