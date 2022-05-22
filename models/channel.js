const mongoose = require("mongoose");
const { Schema } = mongoose;

const channelSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  telegram_id: {
    type: String,
    required: true,
    unique: true,
  },
  regions: {
    type: [String],
    required: true,
  },
  is_official: {
    type: Boolean,
    default: false,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  deleted_at: {
    type: Date,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Channels", channelSchema);
