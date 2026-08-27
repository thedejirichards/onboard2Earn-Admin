import { useState } from "react";
import { useNavigate } from "react-router";
import DesktopAuthLayout from "../components/DesktopAuthLayout";

export default function LoginStartPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const canSubmit = username.trim().length > 0 && password.length > 0;

  const signIn = () => {
    if (!canSubmit) return;
    setError("");
    navigate("/login/token", { state: { username: username.trim() } });
  };

  return (
    <DesktopAuthLayout>
      <div className="w-full max-w-[420px]">
        <div className="bg-white rounded-lg shadow-[0_2px_16px_rgba(0,0,0,0.12)] px-8 py-10">
          <h1 className="text-2xl font-bold text-[#101828] mb-2">Admin sign in</h1>
          <p className="text-sm text-[#667085] mb-8">
            Sign in with your Access Bank NT account to manage staff onboarding.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              signIn();
            }}
          >
            <label className="block text-xs font-medium text-[#344054] mb-1.5" htmlFor="nt-username">
              NT username
            </label>
            <input
              id="nt-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. NG\\j.okafor"
              autoFocus
              autoComplete="username"
              className="w-full border border-[#D0D5DD] focus:border-[#EE7E01] focus:ring-1 focus:ring-[#EE7E01] outline-none rounded-md text-sm text-[#101828] placeholder-[#98A2B3] py-2.5 px-3 mb-4 transition-colors"
            />

            <label className="block text-xs font-medium text-[#344054] mb-1.5" htmlFor="nt-password">
              Password
            </label>
            <input
              id="nt-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              className="w-full border border-[#D0D5DD] focus:border-[#EE7E01] focus:ring-1 focus:ring-[#EE7E01] outline-none rounded-md text-sm text-[#101828] placeholder-[#98A2B3] py-2.5 px-3 mb-2 transition-colors"
            />

            {error && <p className="text-xs text-[#D92D20] mb-2">{error}</p>}

            <p className="text-xs text-[#667085] mb-6">
              Forgot your password? Contact the IT service desk to reset your NT credentials.
            </p>

            <button
              type="submit"
              disabled={!canSubmit}
              className={`w-full font-medium text-sm py-2.5 rounded-md transition-colors ${
                canSubmit ? "bg-[#EE7E01] hover:bg-[#D66F00] text-white" : "bg-[#F2F4F7] text-[#98A2B3] cursor-not-allowed"
              }`}
            >
              Sign in
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#98A2B3] mt-6">
          Restricted access. For Access Bank staff only.
        </p>
      </div>
    </DesktopAuthLayout>
  );
}
