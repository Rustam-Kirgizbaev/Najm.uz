const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema({
  type: {
    type: String,
    enum: ["text", "photo", "video", "document", "audio"],
    required: true,
  },
  file_id: {
    type: String,
  },
  caption: {
    type: String,
  },
  schedule_date: {
    type: Number,
  },
  extra: {},
});

module.exports = mongoose.model("Posts", postSchema);
