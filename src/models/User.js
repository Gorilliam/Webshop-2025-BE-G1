import mongoose from "mongoose";
import bcrypt from "bcrypt";
import {
  emailRegex,
  nameRegex,
} from "../util/regexValidation.js";


const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true,
      match: [nameRegex, "Förnamn får bara innehålla bokstäver och bindestreck"]
    },
    lastName: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true,
      match: [nameRegex, "Efternamn får bara innehålla bokstäver och bindestreck"]
    },
    password: {
      type: String,
      required: true,
      maxlength: 100,
      minlength: 8
    },
    email: {
      type: String,
      required: true,
      maxlength: 100,
      unique: true,
      lowercase: true,
      match: [emailRegex, "Ogiltig e-postadress"]
    },
    isAdmin: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
