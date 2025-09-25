// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch(err => console.error("❌ Error al conectar:", err));

// Ejemplo de modelo
const ProductoSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
  descripcion: String
});
const Producto = mongoose.model("Producto", ProductoSchema);

// Modelo de prueba
const TestSchema = new mongoose.Schema({ name: String });
const Test = mongoose.model("Test", TestSchema);

// Rutas
app.get("/", (req, res) => {
  res.send("API Ecovestir funcionando 🚀");
});

// Listar productos
app.get("/productos", async (req, res) => {
  const productos = await Producto.find();
  res.json(productos);
});

// Crear producto
app.post("/productos", async (req, res) => {
  const nuevo = new Producto(req.body);
  await nuevo.save();
  res.json(nuevo);
});

// Endpoint de prueba con MongoDB Atlas
app.get("/test", async (req, res) => {
  // Guarda un documento de prueba cada vez que entres
  const doc = new Test({ name: "Hola Atlas " + new Date().toLocaleTimeString() });
  await doc.save();

  // Devuelve todos los documentos guardados
  const allDocs = await Test.find();
  res.json(allDocs);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
