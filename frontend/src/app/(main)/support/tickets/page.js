"use client";
import { useState } from "react";
import api from "../../../../utils/api";
import { toast } from "react-hot-toast";

export default function TicketPage() {
  const [form, setForm] = useState({
    reason: "",
    subject: "",
    description: "",
    paymentAddress: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.reason) newErrors.reason = "Reason is required.";
    if (!form.subject) newErrors.subject = "Subject is required.";
    if (!form.description) newErrors.description = "Description is required.";
    if (!form.paymentAddress)
      newErrors.paymentAddress = "Payment address is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const res = await api.post("/tickets", form); // 🔹 gọi API qua axios instance
        console.log("✅ Ticket created:", res.data);
        setSuccess("Ticket created successfully!");
        setForm({
          reason: "",
          subject: "",
          description: "",
          paymentAddress: "",
        });

        toast.success("Ticket created successfully!", {
          duration: 3000,
        });
      } catch (err) {
        console.error("❌ Create ticket failed:", err);
        setSuccess("");
        if (err.response?.data?.message) {
          setErrors({ api: err.response.data.message });
        }
      }
    }
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
              className="bg-transparent border border-white/20 px-3 py-2 rounded-md w-full text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400;"
            >
              <option className="bg-[#1a1a1a]" value="">
                Select reason
              </option>
              <option className="bg-[#1a1a1a]" value="support">
                Support
              </option>
              <option className="bg-[#1a1a1a]" value="payment">
                Payment
              </option>
              <option className="bg-[#1a1a1a]" value="other">
                Other
              </option>
            </select>
            {errors.reason && (
              <p className="text-red-400 text-sm">{errors.reason}</p>
            )}
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
              className="bg-transparent border border-white/20 px-3 py-2 rounded-md w-full text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400;"
            />
            {errors.subject && (
              <p className="text-red-400 text-sm">{errors.subject}</p>
            )}
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="block mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="A detailed description of your problem."
              className="bg-transparent border h-32 border-white/20 px-3 py-2 rounded-md w-full text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400;"
            />
            {errors.description && (
              <p className="text-red-400 text-sm">{errors.description}</p>
            )}
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
              className="bg-transparent border border-white/20 px-3 py-2 rounded-md w-full text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400;"
            />
            {errors.paymentAddress && (
              <p className="text-red-400 text-sm">{errors.paymentAddress}</p>
            )}
          </div>

          {/* Submit */}
          <div className="col-span-2 flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 cursor-pointer hover:bg-blue-500 text-white rounded px-6 py-2"
            >
              Create Ticket
            </button>
          </div>

          {success && (
            <div className="col-span-2 text-center text-green-400">
              {success}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
