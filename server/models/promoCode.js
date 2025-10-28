import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  type: { type: String, enum: ["PERCENT", "FLAT"], required: true },
  value: { type: Number, required: true }, // e.g. 10 for 10%, or 100 for ₹100 flat
  minPurchase: { type: Number, default: 0 }, // optional minimum order
  expiryDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
});

export default mongoose.model("PromoCode", promoCodeSchema);
