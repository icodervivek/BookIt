import React from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface PriceSummaryCardProps {
  experienceId: string;
  experienceName: string;
  selectedDate: string;
  selectedSlot: string;
  price: number;
  tax: number;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  isActive: boolean;
  maxQuantity?: number;
}

export default function PriceSummaryCard({
  experienceId,
  experienceName,
  selectedDate,
  selectedSlot,
  price,
  tax,
  quantity,
  setQuantity,
  isActive,
  maxQuantity = 1,
}: PriceSummaryCardProps) {
  const navigate = useNavigate();

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    } else {
      toast.warning(`Only ${maxQuantity} slots are available for this time.`, {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const subtotal = price * quantity;
  const total = subtotal + tax;

  const handleConfirm = () => {
    navigate(`/experience/${experienceId}/checkout`, {
      state: {
        experienceId,
        experienceName,
        date: selectedDate,
        time: selectedSlot,
        quantity,
        subtotal,
        tax,
        total,
      },
    });
  };

  return (
    <div className="bg-[#efefef] shadow-md rounded-xl p-5 w-full sm:w-80 border border-gray-100">
      <ToastContainer />

      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex justify-between">
          <span>Starts at</span>
          <span className="font-semibold text-black">₹{price}</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Quantity</span>
          <div className="flex items-center gap-2">
            <button
              className="px-2 py-1 border text-black border-gray-300 rounded-[2] hover:bg-gray-100"
              onClick={handleDecrease}
            >
              −
            </button>
            <span className="text-black">{quantity}</span>
            <button
              className="px-2 py-1 border text-black border-gray-300 rounded-[2] hover:bg-gray-100"
              onClick={handleIncrease}
            >
              +
            </button>
          </div>
        </div>

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="text-black">₹{subtotal}</span>
        </div>

        <div className="flex justify-between">
          <span>Taxes</span>
          <span className="text-black">₹{tax}</span>
        </div>
      </div>

      <hr className="my-3 border-0 h-px bg-gray-300" />

      <div className="flex justify-between text-lg font-semibold text-gray-800">
        <span>Total</span>
        <span className="text-black">₹{total}</span>
      </div>

      <button
        className={`w-full py-2 mt-5 rounded-lg font-medium transition-colors duration-200 ${
          isActive
            ? "bg-[#FFD12F] text-black hover:bg-[#ffcc00]"
            : "bg-[#d7d7d7] text-gray-600 cursor-not-allowed"
        }`}
        onClick={handleConfirm}
        disabled={!isActive}
      >
        Confirm
      </button>
    </div>
  );
}
