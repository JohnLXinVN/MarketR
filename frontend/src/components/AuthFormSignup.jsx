"use client";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function AuthFormSignup() {
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const router = useRouter();

  useEffect(() => {
    console.log("123", process.env.NEXT_PUBLIC_API_URL);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password || !captcha) {
      setError("Vui lòng nhập đủ thông tin");
      return;
    }

    try {
      // gọi API verify captcha
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-captcha`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // để gửi session cookie
          body: JSON.stringify({ captcha }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Captcha không đúng");
      }

      // nếu đúng → lưu tạm và chuyển qua 2fa
      localStorage.setItem("preSignup", JSON.stringify({ username, password }));
      router.push("/2fa");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="bg-black/70 p-8 rounded-md shadow-lg text-center  w-[360px] text-white">
        <div className="flex flex-col text-center justify-center mb-7">
          <div className="flex  text-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              fill="white"
              viewBox="0 0 24 24"
            >
              <path d="M18.5347,16.5117 L15.0777,14.9407 C16.2477,14.0257 16.9997,12.6007 16.9997,10.9997 C16.9997,8.2387 14.7617,5.9997 11.9997,5.9997 C9.2387,5.9997 6.9997,8.2387 6.9997,10.9997 C6.9997,12.6007 7.7517,14.0257 8.9227,14.9407 L5.4657,16.5117 C5.1367,16.6617 4.8477,16.8787 4.6157,17.1457 C3.5967,15.6867 2.9997,13.9127 2.9997,11.9997 C2.9997,7.0297 7.0297,2.9997 11.9997,2.9997 C16.9707,2.9997 20.9997,7.0297 20.9997,11.9997 C20.9997,13.9127 20.4027,15.6867 19.3847,17.1457 C19.1527,16.8787 18.8637,16.6617 18.5347,16.5117 M7.9997,10.9997 C7.9997,8.7907 9.7907,6.9997 11.9997,6.9997 C14.2087,6.9997 15.9997,8.7907 15.9997,10.9997 C15.9997,13.2087 14.2087,14.9997 11.9997,14.9997 C9.7907,14.9997 7.9997,13.2087 7.9997,10.9997 M11.9997,20.9997 C9.3127,20.9997 6.9017,19.8227 5.2517,17.9557 C5.4057,17.7247 5.6217,17.5387 5.8797,17.4227 L9.9617,15.5667 C10.5837,15.8447 11.2737,15.9997 11.9997,15.9997 C12.7257,15.9997 13.4157,15.8447 14.0387,15.5667 L18.1207,17.4227 C18.3777,17.5387 18.5937,17.7247 18.7477,17.9557 C17.0987,19.8227 14.6867,20.9997 11.9997,20.9997 M11.9997,1.9997 C6.4767,1.9997 1.9997,6.4767 1.9997,11.9997 C1.9997,17.5227 6.4767,21.9997 11.9997,21.9997 C17.5227,21.9997 21.9997,17.5227 21.9997,11.9997 C21.9997,6.4767 17.5227,1.9997 11.9997,1.9997" />
            </svg>
          </div>

          <p className="text-center text-sm text-gray-300">
            Create an account{" "}
          </p>
        </div>

        {/* Cảnh báo */}
        {error && (
          <div className="bg-red-600 text-white mb-2 text-center px-6 py-3 rounded-md shadow-md">
            <p>{error}</p>
          </div>
        )}

        {/* Form đăng nhập */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
          {/* Username Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent border-1 text-[14px] border-gray-600 text-white placeholder-gray-400 text-center transition-colors py-2"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-1 text-[14px] border-gray-600 text-white placeholder-gray-400 text-center transition-colors py-2"
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

          {/* Captcha Input */}
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Captcha"
              value={captcha}
              onChange={(e) => setCaptcha(e.target.value)}
              className="flex-grow bg-transparent border-1 text-[14px] border-gray-600 text-white placeholder-gray-400 text-center transition-colors py-2"
            />
            <img
              src={`${
                process.env.NEXT_PUBLIC_API_URL
              }/auth/captcha?${Date.now()}`}
              alt="captcha"
              className="mx-auto w-[105px] border rounded"
            />
          </div>

          {/* Nút Submit */}
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="bg-[rgba(255,255,255,.1)] backdrop-blur-sm border border-gray-600 rounded-full w-12 h-12 cursor-pointer flex items-center justify-center hover:bg-gray-700/70 transition-colors"
            >
              {/* Icon Checkmark (sử dụng SVG) */}
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

        {/* Link tạo tài khoản */}
      </div>
      <div className="bg-[rgba(255,255,255,.1)] text-center cursor-pointer text-[0.875rem] mt-[4px] py-[2px]">
        <a
          href="/login"
          className="text-gray-400 hover:text-white transition-colors"
        >
          Already have an account?
        </a>
      </div>
    </div>
  );
}
