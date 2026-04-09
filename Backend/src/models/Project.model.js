import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
    },
    shortDescription: {
      type: String,
      default: "",
      maxlength: [200, "Short description cannot exceed 200 characters"],
    },
    thumbnail: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    images: [
      {
        url: { type: String },
        publicId: { type: String },
      },
    ],
    techStack: [
      {
        type: String,
        trim: true,
      },
    ],
    liveUrl: {
      type: String,
      default: "",
    },
    githubUrl: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      enum: ["web", "mobile", "fullstack", "frontend", "backend", "ai/ml", "other"],
      default: "fullstack",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["completed", "in-progress", "archived"],
      default: "completed",
    },
    order: {
      type: Number,
      default: 0, // For manual ordering on frontend
    },
  },
  { timestamps: true }
);

projectSchema.plugin(mongooseAggregatePaginate);
projectSchema.index({ featured: 1, createdAt: -1 });

const Project = mongoose.model("Project", projectSchema);
export default Project;
