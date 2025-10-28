import express from "express";
import Booking from "../models/booking.js";
import PromoCode from "../models/promoCode.js";
import Experience from "../models/experience.js"; // ✅ make sure you import this

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      fullName,
      email,
      experienceId,
      experienceName,
      date,
      time,
      quantity,
      subtotal,
      tax,
      promoCode,
    } = req.body;

    let discount = 0;
    let finalAmount = subtotal + tax;

    // ✅ Apply promo code logic
    if (promoCode) {
      const code = await PromoCode.findOne({
        code: promoCode,
        isActive: true,
      });

      if (code) {
        const now = new Date();
        if (now <= new Date(code.expiryDate)) {
          if (subtotal >= code.minPurchase) {
            if (code.type === "PERCENT") {
              discount = (subtotal * code.value) / 100;
            } else if (code.type === "FLAT") {
              discount = code.value;
            }
            finalAmount = subtotal + tax - discount;
          }
        }
      }
    }

    // ✅ Create new booking
    const booking = new Booking({
      fullName,
      email,
      experienceId,
      experienceName,
      date,
      time,
      quantity,
      subtotal,
      tax,
      total: subtotal + tax,
      promoCode: promoCode || null,
      discount,
      finalAmount,
      status: "Pending",
    });

    await booking.save();

    // ✅ Update the bookedCount in Experience
    const experience = await Experience.findById(experienceId);
    if (!experience)
      return res.status(404).json({ message: "Experience not found" });

    // normalize date formats
    const bookingDateStr = new Date(date).toLocaleDateString("en-CA");

    const dateSlot = experience.availableDates.find(
      (d) => new Date(d.date).toLocaleDateString("en-CA") === bookingDateStr
    );

    if (!dateSlot)
      return res.status(400).json({ message: "Date not available" });

    const timeSlot = dateSlot.slots.find((s) => s.time === time);
    if (!timeSlot)
      return res.status(400).json({ message: "Time slot not found" });

    if (timeSlot.bookedCount + quantity > timeSlot.totalCount) {
      return res.status(400).json({ message: "Not enough slots available" });
    }

    // ✅ Increment bookedCount
    timeSlot.bookedCount += quantity;
    await experience.save();

    // ✅ Return response
    res.status(201).json({
      message: "Booking created successfully",
      booking,
      refId: booking._id,
    });
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ message: "Error creating booking" });
  }
});

export default router;
