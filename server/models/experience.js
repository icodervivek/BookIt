import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    slots: [
      {
        time: {
          type: String,
          required: true,
        },
        totalCount: {
          type: Number,
          required: true,
          min: 1,
        },
        bookedCount: {
          type: Number,
          default: 0,
          min: 0,
        },
      },
    ],
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    experienceImageURL: {
      type: String,
      required: true,
      trim: true,
    },
    experienceName: {
      type: String,
      required: true,
      trim: true,
    },
    experiencePlace: {
      type: String,
      required: true,
      trim: true,
    },
    experienceDescription: {
      type: String,
      required: true,
      trim: true,
    },
    experiencePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    experienceAbout: {
      type: String,
      required: true,
      trim: true,
    },
    availableDates: [slotSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Experience", experienceSchema);
