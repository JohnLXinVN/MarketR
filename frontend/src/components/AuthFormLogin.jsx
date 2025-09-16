"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthFormLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaUrl, setCaptchaUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const refreshCaptcha = () => {
    setCaptchaUrl(`${apiBase}/auth/captcha?${Date.now()}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    if (!captcha.trim()) {
      setError("Captcha is required");
      return;
    }
    try {
      setLoading(true);

      // 1) Verify captcha
      const capRes = await fetch(`${apiBase}/auth/verify-captcha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ captcha }),
      });
      if (!capRes.ok) {
        const d = await capRes.json().catch(() => ({}));
        throw new Error(d.message || "Captcha invalid");
      }

      // 2) Check username + password
      const res = await fetch(`${apiBase}/auth/login-check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || "Invalid username or password");
      }

      // Nếu đúng → lưu tạm và chuyển sang 2FA
      localStorage.setItem("preLogin", JSON.stringify({ username, password }));
      router.push("/2fa?mode=login");
    } catch (err) {
      setError(err.message);
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 rounded-md">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="bg-black/70 p-8 rounded-md shadow-lg text-center w-[360px] text-white">
        <h1 className="text-white text-2xl font-bold mb-3">Welcome back</h1>
        <img
          src="/images/russianMarket.png"
          alt="Logo"
          className="w-full mb-4"
        />
        <div className="flex justify-center text-center">
          <div className="bg-red-600 text-white text-[12px] font-semibold py-[4px] px-[12px] rounded-full shadow-lg">
            All domains from google is <b>fake scam!</b>
          </div>
        </div>
        {error && (
          <div className="bg-red-600 text-white mb-2 px-6 py-3 rounded-md shadow-md">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-transparent border border-gray-600 text-white placeholder-gray-400 text-center py-2"
          />

          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-gray-600 text-white placeholder-gray-400 text-center py-2"
            />
            <span className="absolute right-1 top-2 text-gray-400">
              {/* Icon ổ khóa (sử dụng SVG) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Captcha"
              value={captcha}
              onChange={(e) => setCaptcha(e.target.value)}
              className="flex-grow bg-transparent border-1 text-[14px] border-gray-600 text-white placeholder-gray-400 text-center transition-colors py-2"
            />
            <img
              src={captchaUrl}
              alt="captcha"
              onClick={refreshCaptcha}
              className="w-[104px] mx-auto border rounded cursor-pointer"
            />
          </div>

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-[rgba(255,255,255,.1)] border border-gray-600 rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-700/70 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>

      <div className="bg-[rgba(255,255,255,.1)] text-center cursor-pointer text-sm mt-1 py-1">
        <Link
          href="/signup"
          className="text-gray-400 hover:text-white transition-colors"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}
