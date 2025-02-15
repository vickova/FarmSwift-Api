import mongoose from "mongoose";
// import bcrypt from 'bcrypt'


const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default:1,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId, // Referencing the customer who wrote the review
      ref: "User",
      required: true,
    },
    reviewDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match:[
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide valid email'
    ],
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    photo: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
      default: "customer",
      enum: ["customer", "seller"], // Valid roles
    },
    user_role: {
      type: String,
      default: "user",
      enum: ["user", "admin"], // Valid roles
    },

    description: {
      type: String,
      default: "customer",
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },

    reviews: [reviewSchema], // Array to hold ratings and reviews for sellers

  },
  { timestamps: true }
);

// userSchema.pre('save', async function(next){
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next()
// })        


// module.exports = mongoose.model('User', AuthSchema)
export default mongoose.model("User", userSchema);
