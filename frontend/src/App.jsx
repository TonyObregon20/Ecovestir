import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Producto from "./components/Productos";
import "./index.css"; // CSS global con tu paleta de colores
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Producto />
      <Footer />
      
    </>
  );
}

export default App;
