import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Skill category is required"],
      enum: ["frontend", "backend", "database", "devops", "tools", "languages", "other"],
    },
    proficiency: {
      type: Number,
      min: 0,
      max: 100,
      default: 80, // percentage
    },
    icon: {
      type: String,
      default: "", // icon class or URL
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Skill = mongoose.model("Skill", skillSchema);
export default Skill;
