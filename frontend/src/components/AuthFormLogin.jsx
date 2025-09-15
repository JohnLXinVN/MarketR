"use client";
import { useState } from "react";
import { FaUser } from "react-icons/fa";

export default function AuthFormLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`${type} with ${username}/${password} captcha:${captcha}`);
  };

  return (
    <div>
      <div className="bg-black/70 p-8 rounded-md shadow-lg text-center w-[360px] text-white">
        {/* icon + title */}
        {/* Logo và Tiêu đề */}
        <h1 className="text-white text-3xl font-bold tracking-widest">
          Welcome to
        </h1>
        <img
          src="/images/russianMarket.png"
          alt="Russian Market Logo"
          className="w-full mb-2"
        />

        {/* Cảnh báo */}

        <div className="bg-red-600 text-white mb-2 text-center px-6 py-3 rounded-md shadow-md">
          <p>Invalid username or password</p>
        </div>
        <div className="flex justify-center text-center">
          <div className="bg-red-600 text-white text-[12px] font-semibold py-[4px] px-[12px] rounded-full shadow-lg">
            All domains from google is <b>fake scam!</b>
          </div>
        </div>

        {/* Form đăng nhập */}
        <form className="w-full flex flex-col gap-6">
          {/* Username Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Username"
              className="w-full bg-transparent border-1 text-[14px] border-gray-600 text-white placeholder-gray-400 text-center transition-colors py-2"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
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
              className="flex-grow bg-transparent border-1 text-[14px] border-gray-600 text-white placeholder-gray-400 text-center transition-colors py-2"
            />
            <img src="/assets/captcha.png" alt="Captcha" className="h-10" />
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
          href="/signup"
          className="text-gray-400 hover:text-white transition-colors"
        >
          Create an account
        </a>
      </div>
    </div>
  );
}
