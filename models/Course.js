const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema(
  {
    courseName: {
      type: String,
      required: true
    },
    courseDescription: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: false
    },
    instructor: { type: Schema.Types.ObjectId, ref: "User" },
    category: { type: Schema.Types.String, ref: "Category" }
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = Course = mongoose.model("courses", CourseSchema);
