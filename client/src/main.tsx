import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home.tsx";
import ViewExperience from "./ViewExperience";
import CheckoutPage from "./CheckoutPage";
import BookingSuccess from "./BookingSuccess.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/experience/:id" element={<ViewExperience />} />
        <Route path="/experience/:id/checkout" element={<CheckoutPage />} />
        <Route path="/booking-success" element={<BookingSuccess />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
