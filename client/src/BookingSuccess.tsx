import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";

interface BookingState {
  refId?: string;
}

export default function BookingSuccess(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as BookingState | null;
  const { refId } = state || {};

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <img
          src="/success.png"
          alt="Success"
          className="h-24 mb-4"
        />
        <h2 className="text-2xl font-semibold mt-4 text-gray-900">
          Booking Confirmed
        </h2>
        <p className="text-gray-600 mt-2 text-sm">
          Ref ID: <span className="font-medium">{refId || "N/A"}</span>
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-6 px-5 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-sm font-medium"
        >
          Back to Home
        </button>
      </div>
    </>
  );
}
