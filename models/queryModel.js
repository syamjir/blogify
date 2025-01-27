const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const querySchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Query = mongoose.model("Query", querySchema);
module.exports = Query;
