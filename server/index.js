import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import experienceRoutes from "./routes/experienceRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import promoRoutes from "./routes/promoRoutes.js";
import cors from "cors";
const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/experiences", experienceRoutes);
app.use("/bookings", bookingRoutes);
app.use("/promo", promoRoutes);


app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
