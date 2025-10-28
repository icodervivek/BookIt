import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import experienceRoutes from "./routes/experienceRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js"
import promoRoutes from "./routes/promoRoutes.js"
import cors from "cors";
const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL, 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());

app.use("/experiences", experienceRoutes);
app.use("/bookings", bookingRoutes);
app.use("/promo", promoRoutes);


// Connected to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to Mongodb"))
  .catch((error) => console.log(`Error connecting with Mongodb`));


app.listen(process.env.PORT, () => {
  console.log(`Server is up and running on ${process.env.PORT}`);
});
