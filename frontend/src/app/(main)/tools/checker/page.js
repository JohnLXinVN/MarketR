export default function CheckerPage() {
  return (
    <div className="flex flex-col items-center justify-center p-10 w-full  text-[rgba(255,255,255,0.85)]">
      <div className="max-w-2xl text-center px-6">
        <h1 className="text-3xl font-bold mb-6">
          This page requires account activation
        </h1>
        <p className="text-lg mb-8">
          To activate your account,{" "}
          <span className="text-red-500 font-semibold">please add $100</span> to
          your balance. This is a one-time payment for activation
        </p>
        <button className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 transition font-semibold">
          payment Page
        </button>
      </div>

      {/* Footer */}
    </div>
  );
}
