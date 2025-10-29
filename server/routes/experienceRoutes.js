import express from "express";
import Experience from "../models/experience.js";

const router = express.Router();


/**
 * Get all experiences
 */
router.get("/", async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ createdAt: -1 });
    res.status(200).json(experiences);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch experiences", error });
  }
});

/**
 * Get experience by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience)
      return res.status(404).json({ message: "Experience not found" });
    res.status(200).json(experience);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch experience", error });
  }
});


/**
 * Get all slots for a specific experience (now embedded inside Experience)
 */
router.get("/:id/slots", async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience)
      return res.status(404).json({ message: "Experience not found" });

    res.json(experience.availableDates || []);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch slots", error });
  }
});

export default router;
