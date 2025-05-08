// controllers/plantController.js
import Plants from "../model/Plants.js";
import User from "../model/User.js";

export const savePlantAnalysis = async (req, res) => {
  const { imageUrl, isPlant, isHealthy, diseases, latitude, longitude, analyzedAt } = req.body;
  const userId = req.user.id; // Assuming req.user is set by authentication middleware

  try {
    // Check if the user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Create a new plant analysis record
    const newPlant = new Plants({
      userId,
      imageUrl,
      isPlant,
      isHealthy,
      diseases,
      latitude,
      longitude,
      analyzedAt,
    });

    await newPlant.save();
    return res.status(201).json({ success: true, message: "Plant analysis saved successfully!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getPlantAnalysis = async (req, res) => {
  const userId = req.user.id; // Assuming req.user is set by authentication middleware

  try {
    // Retrieve plant analysis records for the user
    const plants = await Plants.find({ userId });
    console.log({plants});

    if (!plants.length) {
      return res.status(200).json({ success: false, message: "No plant analysis found", data:plants });
    }

    return res.status(200).json({ success: true, data: plants });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const deletePlantAnalysis = async (req, res) => {
    const { id } = req.params; // Get plant analysis ID from the URL params
    const userId = req.user.id; // Assuming req.user is set by authentication middleware
  
    try {
      // Check if the plant analysis exists and belongs to the authenticated user
      const plantAnalysis = await Plants.findOne({ _id: id, userId });
  
      if (!plantAnalysis) {
        return res.status(404).json({ success: false, message: "Plant analysis not found" });
      }
  
      // Delete the plant analysis record
      await plantAnalysis.deleteOne();
  
      return res.status(200).json({ success: true, message: "Plant analysis deleted successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  };