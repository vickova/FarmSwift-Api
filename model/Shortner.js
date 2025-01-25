import mongoose from "mongoose";

const ShortnerSchema = new mongoose.Schema(
  {
    OriginalUrl: {
        type:String,
    },
    ShortUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Shortner", ShortnerSchema);
