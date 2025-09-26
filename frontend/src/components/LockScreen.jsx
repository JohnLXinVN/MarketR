"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

export default function LockScreen({ mode }) {
  const [pin, setPin] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = (num) => {
    if (pin.length < 10) setPin(pin + num); // giới hạn 10 ký tự
  };

  const handleClean = () => setPin("");
  const handleUnlock = async () => {
    setError("");
    if (pin.length < 4 || pin.length > 6) {
      setError("PIN must be at least 4 and at most 6 digits");
      return;
    }
    try {
      setLoading(true);

      if (mode === "signup") {
        // lấy dữ liệu signup trước đó
        const preSignup = JSON.parse(localStorage.getItem("preSignup") || "{}");
        if (!preSignup.username || !preSignup.password) {
          throw new Error("Don&apos;t have signup info");
        }

        // gọi API signup
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              username: preSignup.username,
              password: preSignup.password,
              pincode: pin,
            }),
          }
        );

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Signup failed");
        }
        toast.success("Signup successful!");
        // Signup thành công → clear storage
        localStorage.removeItem("preSignup");
        router.push("/login");
      } else if (mode === "login") {
        const preLogin = JSON.parse(localStorage.getItem("preLogin") || "{}");
        if (!preLogin.username || !preLogin.password) {
          throw new Error("Don&apos;t have login info");
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              username: preLogin.username,
              password: preLogin.password,
              pincode: pin,
            }),
          }
        );

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Login failed");
        }
        const data = await res.json();

        localStorage.removeItem("preLogin");

        const token = data.token;
        const decoded = jwtDecode(token);

        localStorage.setItem("access_token_exp", decoded.exp.toString());
        localStorage.setItem("access_token", data.token);
        toast.success("Login successful!");

        router.push("/dashboard");
      } else {
        throw new Error("Lack of mode (login/signup)");
      }
    } catch (err) {
      setError(err.message);
      setLoading(false); // tắt loading
    } finally {
      setLoading(false); // tắt loading
    }

    // giả lập check pin
  };

  return (
    <div className="flex flex-col items-center justify-center pt-5 pb-10 pl-4 pr-4 bg-black/70 text-white">
      {/* icon + welcome */}
      {loading && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 rounded-md">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {error && (
        <div className="bg-red-600 text-white mb-2 text-center px-6 py-3 rounded-md shadow-md">
          <p>{error}</p>
        </div>
      )}
      {mode === "login" ? (
        <div className="flex flex-col items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
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
          <p className="mb-14 text-lg text-gray-300">Welcome back, annhm!</p>
        </div>
      ) : (
        <div className="bg-green-600 text-white text-center mb-[48px] p-4 rounded-md shadow-lg">
          Registration successful! Please set up your 2FA.
        </div>
      )}

      {/* Ô nhập PIN */}
      <div className="w-72 h-12 border-2 text-center border-white rounded-md flex items-center justify-center px-3 mb-8 bg-transparent">
        <span className="tracking-widest text-center text-2xl">
          {pin
            .split("")
            .map((_, i) => "•")
            .join(" ")}
        </span>
      </div>

      {/* Bàn phím số */}
      <div className="space-y-4">
        {/* hàng 1: 1-5 */}
        <div className="flex space-x-2 justify-center">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => handleClick(num)}
              className="w-14 h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-lg font-semibold"
            >
              {num}
            </button>
          ))}
        </div>

        {/* hàng 2: 6-0 */}
        <div className="flex space-x-2 justify-center">
          {[6, 7, 8, 9, 0].map((num) => (
            <button
              key={num}
              onClick={() => handleClick(num)}
              className="w-14 h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-lg font-semibold"
            >
              {num}
            </button>
          ))}
        </div>

        {/* hàng 3: Clean & Unlock */}
        <div className="flex space-x-12 justify-center pt-4">
          <button
            onClick={handleClean}
            className="text-lg cursor-pointer font-medium text-gray-300 hover:text-white"
          >
            Clean
          </button>
          <button
            onClick={handleUnlock}
            className="text-lg font-medium cursor-pointer text-gray-300 hover:text-white"
          >
            Unlock
          </button>
        </div>
      </div>
    </div>
  );
}
