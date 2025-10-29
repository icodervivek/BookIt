import { useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import type { Summary } from "../types";

interface PriceSummaryProps {
  summary: Summary;
  formData: {
    fullName: string;
    email: string;
    agreedToTerms: boolean;
  };
  promoCode: string | null;
  discount: number;
  onConfirm: () => Promise<void>;
}

export default function PriceSummary({
  summary,
  formData,
  promoCode,
  discount,
}: PriceSummaryProps): JSX.Element {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    experienceId,
    experienceName,
    date,
    time,
    quantity,
    subtotal,
    tax,
    total,
  } = summary;

  const handleConfirmBooking = async () => {
    if (!formData.fullName.trim() || !formData.email.trim()) {
      toast.error("Please fill in all required details.");
      return;
    }

    if (!formData.agreedToTerms) {
      toast.error("You must agree to the terms and conditions.");
      return;
    }

    setLoading(true);

    // Convert date to ISO format (YYYY-MM-DD) for backend
    const formattedDate = new Date(date).toLocaleDateString("en-CA");

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      experienceId,
      experienceName,
      date: formattedDate,
      time,
      quantity,
      subtotal,
      tax,
      promoCode: promoCode || null,
    };

    console.log("📤 Sending booking payload:", payload);
    console.log("📅 Original date:", date, "→ Formatted:", formattedDate)

    try {
      const res = await axios.post(`${API_BASE_URL}/bookings`, payload);

      if (res.status === 201) {
        toast.success("Booking confirmed!");
        navigate("/booking-success", {
          state: { refId: res.data.refId },
        });
      } else {
        toast.error(res.data.message || "Booking failed. Try again.");
      }
    } catch (err: any) {
      console.error("Booking error:", err);
      console.error("Full error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      
      const errorData = err.response?.data;
      const errorMsg = errorData?.message || err.message || "Server error occurred.";
      const missingFields = errorData?.missingFields;
      const availableDates = errorData?.availableDates;
      const availableSlots = errorData?.availableSlots;
      
      if (missingFields) {
        toast.error(`Missing fields: ${missingFields.join(", ")}`);
      } else if (availableDates) {
        toast.error(`${errorMsg}. Available: ${availableDates.join(", ")}`);
      } else if (availableSlots) {
        toast.error(`${errorMsg}. Available: ${availableSlots.join(", ")}`);
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f9f9f9] rounded-lg p-6 shadow-sm w-full sm:w-1/3">
      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex justify-between">
          <span>Experience</span>
          <span className="font-semibold">{experienceName}</span>
        </div>

        <div className="flex justify-between">
          <span>Date</span>
          <span>{date}</span>
        </div>

        <div className="flex justify-between">
          <span>Time</span>
          <span>{time}</span>
        </div>

        <div className="flex justify-between">
          <span>Qty</span>
          <span>{quantity}</span>
        </div>

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="flex justify-between">
          <span>Taxes</span>
          <span>₹{tax}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600 font-medium">
            <span>Discount ({promoCode})</span>
            <span>- ₹{discount}</span>
          </div>
        )}
      </div>

      <hr className="my-3 border-0 h-px bg-gray-300" />

      <div className="flex justify-between text-lg font-semibold text-gray-800">
        <span>Total</span>
        <span className="text-black">₹{total}</span>
      </div>

      <button
        onClick={handleConfirmBooking}
        disabled={loading}
        className={`w-full py-2 mt-5 rounded-md font-medium ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#FFD12F] hover:bg-[#ffcc00]"
        }`}
      >
        {loading ? "Processing..." : "Pay and Confirm"}
      </button>
    </div>
  );
}
