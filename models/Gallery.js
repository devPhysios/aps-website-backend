const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  imageUrl: { 
    type: String, 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  description: 
  { type: String, 
    required: true },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model("Gallery", gallerySchema);
