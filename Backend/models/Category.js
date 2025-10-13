const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: [true, "El nombre es obligatorio"], unique: true,trim: true },
  description: { type: String, trim: true, default: "" },
  image: { type: String, default: "https://via.placeholder.com/400x400?text=Sin+Imagen"},
  productsCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  position: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Category", categorySchema);