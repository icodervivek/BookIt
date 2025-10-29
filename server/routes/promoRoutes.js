import express from "express";
import PromoCode from "../models/promoCode.js";
import mongoose from "mongoose";
const router = express.Router();
import connectToDatabase from "../lib/mongodb.js";


router.post("/validate", async (req, res) => {
  await connectToDatabase();

  const { code, subtotal } = req.body;

  try {
    const promo = await PromoCode.findOne({ code, isActive: true });

    if (!promo) {
      return res.status(400).json({ success: false, message: "Invalid promo code." });
    }

    if (new Date() > promo.expiryDate) {
      return res.status(400).json({ success: false, message: "Promo code expired." });
    }

    if (subtotal < promo.minPurchase) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase ₹${promo.minPurchase} required.`,
      });
    }

    let discount = 0;
    if (promo.type === "PERCENT") {
      discount = (subtotal * promo.value) / 100;
    } else if (promo.type === "FLAT") {
      discount = promo.value;
    }

    return res.json({
      success: true,
      discount,
      message: `Promo applied: ${promo.code}`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});


export default router;
