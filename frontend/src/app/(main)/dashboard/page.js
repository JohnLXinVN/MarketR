import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 gap-6">
        {/* Cột trái */}
        <div className="bg-black/20 p-6 rounded-md space-y-4">
          <h2 className="font-bold text-xl">Attention</h2>
          <p>Please bookmark or save all links to always have access!</p>
          <p className="text-blue-400">WEB: https://rm1.cm/</p>
          <p className="text-blue-400">WEB: https://rm1.ad/</p>
          <p className="text-blue-400">WEB: https://russianmarket.com/</p>
          <p className="text-red-500">TOR: http://russian76uguxb....onion</p>
        </div>

        {/* Cột phải */}
        <div className="bg-black/20 p-6 rounded-md space-y-4">
          <h2 className="font-bold text-xl text-blue-400">Important notice</h2>
          <p>
            Our online store does not have a Telegram channel nor do we have any
            contacts on Telegram.
            <span className="text-red-500 font-semibold"> ONLY </span>
            communicate through this website’s ticket system.
          </p>
        </div>
      </div>
    </div>
  );
}
