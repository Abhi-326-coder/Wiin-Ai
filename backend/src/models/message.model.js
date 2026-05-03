import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
  },
  role: {
    type: String,
    enum: ["user", "assistant"],
  },
  content: String,
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);
