import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter category name"],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [false, "Please enter category description"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
