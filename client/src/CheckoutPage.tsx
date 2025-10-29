import React, { useState, type JSX } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CheckoutForm from "./components/CheckoutForm";
import PriceSummary from "./components/PriceSummary";
import Navbar from "./components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import type { FormData, Summary, BookingState } from "./types";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export default function CheckoutPage(): JSX.Element {
  const { id: experienceId } = useParams<{ id: string }>();
  const { state } = useLocation();
  const bookingData = (state as BookingState) || {};

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    agreedToTerms: false,
  });

  const [summary, setSummary] = useState<Summary>({
    experienceId: bookingData.experienceId || experienceId,
    experienceName: bookingData.experienceName || "",
    date: bookingData.date || "",
    time: bookingData.time || "",
    quantity: bookingData.quantity || 1,
    subtotal: bookingData.subtotal || 0,
    tax: bookingData.tax || 0,
    total: bookingData.total || 0,
  });

  const [promo, setPromo] = useState<string | null>(null);
  const [discount, setDiscount] = useState<number>(0);

  const navigate = useNavigate();

  const handleApplyPromo = async (code: string): Promise<void> => {
    if (!code.trim()) {
      toast.error("Please enter a promo code", { position: "top-center" });
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/promo/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal: summary.subtotal }),
      });

      const data = await res.json();

      if (data.success) {
        const discountAmount: number = data.discount || 0;
        const finalTotal = summary.subtotal + summary.tax - discountAmount;

        setPromo(code);
        setDiscount(discountAmount);
        setSummary((prev) => ({ ...prev, total: finalTotal }));

        toast.success(`Promo code applied! You saved ₹${discountAmount}`, {
          position: "top-center",
        });
      } else {
        toast.error(data.message || "Invalid or expired promo code", {
          position: "top-center",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error applying promo", { position: "top-center" });
    }
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string | boolean } }
  ): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleConfirm = async (): Promise<void> => {
    if (!formData.fullName.trim() || !formData.email.trim()) {
      toast.error(
        "Please fill in your full name and email before proceeding.",
        {
          position: "top-center",
        }
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.", {
        position: "top-center",
      });
      return;
    }

    if (!formData.agreedToTerms) {
      toast.error(
        "Please agree to the terms and safety policy before continuing.",
        {
          position: "top-center",
        }
      );
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          ...summary,
          promoCode: promo,
          discount: discount,
          finalAmount: summary.total,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        navigate("/booking-success", {
          state: { refId: data.refId || data.bookingId || "N/A" },
        });
      } else {
        toast.error(data.message || "Booking failed", {
          position: "top-center",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error confirming booking", { position: "top-center" });
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-[1200px] mx-auto mt-6 px-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-black font-medium hover:underline"
        >
          ← Checkout
        </button>
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-6 p-10">
        <CheckoutForm
          formData={formData}
          onChange={handleChange}
          onApplyPromo={handleApplyPromo}
        />
        <PriceSummary
          summary={summary}
          formData={formData}
          promoCode={promo}
          discount={discount}
          onConfirm={handleConfirm}
        />
      </div>
    </>
  );
}
