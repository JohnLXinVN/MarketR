"use client";
import { useState } from "react";

export default function LockScreen() {
  const [pin, setPin] = useState("");

  const handleClick = (num) => {
    if (pin.length < 10) setPin(pin + num); // giới hạn 10 ký tự
  };

  let typeScreen = "login";

  const handleClean = () => setPin("");
  const handleUnlock = () => {
    if (pin === "12345") {
      alert("Unlocked!");
    } else {
      alert("Wrong PIN!");
      setPin("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center pt-5 pb-10 pl-4 pr-4 bg-black/70 text-white">
      {/* icon + welcome */}

      {typeScreen === "login" ? (
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
