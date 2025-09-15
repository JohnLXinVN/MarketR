"use client";
import { useState } from "react";

export default function TicketPage() {
  const [form, setForm] = useState({
    reason: "",
    subject: "",
    description: "",
    paymentAddress: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
  };

  return (
    <div className="flex justify-center items-start p-10 text-[rgba(255,255,255,0.85)]">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Create a new ticket
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {/* Reason contact */}
          <div className="col-span-1">
            <label className="block mb-1">Reason contact</label>
            <select
              name="reason"
              value={form.reason}
              onChange={handleChange}
              className="w-full bg-black/50 border border-gray-600 rounded px-3 py-2 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select reason</option>
              <option value="support">Support</option>
              <option value="payment">Payment</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Subject */}
          <div className="col-span-1">
            <label className="block mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Subject"
              className="w-full bg-black/50 border border-gray-600 rounded px-3 py-2 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="block mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="A detailed description of your problem."
              className="w-full h-32 bg-black/50 border border-gray-600 rounded px-3 py-2 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Payment Address */}
          <div className="col-span-2">
            <label className="block mb-1">Payment Address</label>
            <input
              type="text"
              name="paymentAddress"
              value={form.paymentAddress}
              onChange={handleChange}
              placeholder="Payment Address"
              className="w-full bg-black/50 border border-gray-600 rounded px-3 py-2 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit */}
          <div className="col-span-2 flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white rounded px-6 py-2"
            >
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
