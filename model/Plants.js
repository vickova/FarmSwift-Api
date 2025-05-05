// models/Plant.js
import mongoose from 'mongoose';

const plantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  isPlant: {
    type: Boolean,
    required: true,
  },
  isHealthy: {
    type: Boolean,
    required: true,
  },
  diseases: [
    {
      name: String,
      probability: Number,
    },
  ],
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  analyzedAt: {
    type: Date,
    required: true,
  },
});

export default mongoose.model('Plant', plantSchema);
