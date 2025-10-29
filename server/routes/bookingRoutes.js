import express from "express";
import Booking from "../models/booking.js";
import Experience from "../models/experience.js";
import PromoCode from "../models/promoCode.js";
import connectToDatabase from "../lib/mongodb.js";

const router = express.Router();

router.post("/", async (req, res) => {
  await connectToDatabase();

  try {
    console.log("📥 Received booking request");
    console.log("Request body:", JSON.stringify(req.body, null, 2));

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

    // ✅ Validate ALL required fields
    const missingFields = [];
    if (!fullName) missingFields.push("fullName");
    if (!email) missingFields.push("email");
    if (!experienceId) missingFields.push("experienceId");
    if (!experienceName) missingFields.push("experienceName");
    if (!date) missingFields.push("date");
    if (!time) missingFields.push("time");
    if (quantity === undefined || quantity === null)
      missingFields.push("quantity");
    if (subtotal === undefined || subtotal === null)
      missingFields.push("subtotal");
    if (tax === undefined || tax === null) missingFields.push("tax");

    if (missingFields.length > 0) {
      console.error("❌ Missing fields:", missingFields);
      return res.status(400).json({
        message: "Missing required fields",
        missingFields,
        receivedBody: req.body,
      });
    }

    // ✅ Validate experienceId format (MongoDB ObjectId)
    if (!experienceId.match(/^[0-9a-fA-F]{24}$/)) {
      console.error("❌ Invalid experienceId format:", experienceId);
      return res.status(400).json({
        message: "Invalid experience ID format",
        receivedId: experienceId,
      });
    }

    console.log("✅ All required fields present");

    let discount = 0;
    let finalAmount = subtotal + tax;

    // Apply promo code logic
    if (promoCode) {
      console.log("🎫 Applying promo code:", promoCode);
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
            console.log("✅ Promo applied. Discount:", discount);
          } else {
            console.log("⚠️ Subtotal below minimum purchase");
          }
        } else {
          console.log("⚠️ Promo code expired");
        }
      } else {
        console.log("⚠️ Promo code not found or inactive");
      }
    }

    // Check if experience exists
    console.log("🔍 Looking for experience:", experienceId);
    const experience = await Experience.findById(experienceId);

    if (!experience) {
      console.error("❌ Experience not found:", experienceId);
      return res.status(404).json({
        message: "Experience not found",
        experienceId,
      });
    }

    console.log("✅ Experience found:", experience.name);

    // Normalize date
    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      console.error("❌ Invalid date format:", date);
      return res.status(400).json({
        message: "Invalid date format",
        receivedDate: date,
      });
    }

    const bookingDateStr = bookingDate.toLocaleDateString("en-CA");
    console.log("📅 Looking for date slot:", bookingDateStr);

    const dateSlot = experience.availableDates.find(
      (d) => new Date(d.date).toLocaleDateString("en-CA") === bookingDateStr
    );

    if (!dateSlot) {
      console.error("❌ Date not available:", bookingDateStr);
      const availableDates = experience.availableDates.map((d) =>
        new Date(d.date).toLocaleDateString("en-CA")
      );
      console.log("Available dates:", availableDates);

      return res.status(400).json({
        message: "Date not available",
        requestedDate: bookingDateStr,
        availableDates,
      });
    }

    console.log("✅ Date slot found");
    console.log("⏰ Looking for time slot:", time);

    const timeSlot = dateSlot.slots.find((s) => s.time === time);

    if (!timeSlot) {
      console.error("❌ Time slot not found:", time);
      const availableSlots = dateSlot.slots.map((s) => s.time);
      console.log("Available slots:", availableSlots);

      return res.status(400).json({
        message: "Time slot not found",
        requestedTime: time,
        availableSlots,
      });
    }

    console.log(
      "✅ Time slot found. Available:",
      timeSlot.totalCount - timeSlot.bookedCount
    );

    // Check availability
    if (timeSlot.bookedCount + quantity > timeSlot.totalCount) {
      console.error("❌ Not enough slots");
      return res.status(400).json({
        message: "Not enough slots available",
        requested: quantity,
        available: timeSlot.totalCount - timeSlot.bookedCount,
      });
    }

    // Create booking
    console.log("💾 Creating booking...");
    const booking = new Booking({
      fullName,
      email,
      experienceId,
      experienceName,
      date: bookingDate,
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
    console.log("✅ Booking saved:", booking._id);

    // Update bookedCount
    timeSlot.bookedCount += quantity;
    await experience.save();
    console.log("✅ Experience updated");

    res.status(201).json({
      message: "Booking created successfully",
      booking,
      refId: booking._id,
    });
  } catch (err) {
    console.error("❌ ERROR creating booking:", err);
    console.error("Stack:", err.stack);
    res.status(500).json({
      message: "Error creating booking",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

export default router;
