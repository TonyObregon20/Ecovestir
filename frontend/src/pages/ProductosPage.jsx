// Página de Productos
// - Lista los productos obtenidos desde el backend (/api/products).
// - Soporta paginación, búsqueda (`q`) y filtro por categoría.
// - Para cambiar la URL del backend ajusta `frontend/.env` con VITE_API_URL o modifica `frontend/src/api.js`.

import { useEffect, useState } from "react";
import ProductCard from "../components/Productcard";
import "../index.css";
import api from "../api/api";

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        setLoading(true);
        const q = search ? `&q=${encodeURIComponent(search)}` : "";
        const cat = category ? `&category=${encodeURIComponent(category)}` : "";
        const res = await api.get(
          `/api/products?page=${page}&limit=12${q}${cat}`
        );
        const data = res.data && res.data.data ? res.data.data : res.data;
        const meta =
          res.data && res.data.meta
            ? res.data.meta
            : { total: data.length, page: 1, limit: data.length };
        if (mounted) {
          setProductos(data.map(mapProductToUI));
          setTotalPages(meta.totalPages || 1);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError("No se pudieron cargar los productos");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => {
      mounted = false;
    };
  }, [search, category, page]);

  const handleCategoryChange = (cat) => {
    setCategory((prev) => (prev === cat ? "" : cat));
    setPage(1);
  };

  return (
    <main className="productos-page">
      <aside className="filtros-sidebar">
        <h3>Filtros</h3>

        <div className="filtro-busqueda">
          <label htmlFor="search">Buscar</label>
          <input
            id="search"
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <fieldset className="filtro-categorias">
          <legend>Categorías</legend>
          {["camisetas", "pantalones", "accesorios", "otros"].map((cat) => (
            <label key={cat} htmlFor={cat}>
              <input
                type="checkbox"
                id={cat}
                checked={category === cat}
                onChange={() => handleCategoryChange(cat)}
              />
              {cat}
            </label>
          ))}
        </fieldset>

        <button
          className="btn-limpiar"
          onClick={() => {
            setSearch("");
            setCategory("");
          }}
        >
          Limpiar filtros
        </button>
      </aside>

      <section className="productos-listado">
        <header>
          <h2>Nuestra Colección Orgánica</h2>
          <p>
            Descubre nuestra gama de ropa sostenible fabricada con materiales
            100% orgánicos.
          </p>
        </header>

        {loading ? (
          <p style={{ padding: 20 }}>Cargando productos...</p>
        ) : error ? (
          <p style={{ padding: 20, color: "red" }}>{error}</p>
        ) : (
          <div className="grid-productos">
            {productos.length > 0 ? (
              productos.map((p) => <ProductCard key={p.id} {...p} />)
            ) : (
              <p className="sin-productos">No se encontraron productos.</p>
            )}
          </div>
        )}

        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 20 }}
        >
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </button>
          <span style={{ margin: "0 12px" }}>
            Página {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Siguiente
          </button>
        </div>
      </section>
    </main>
  );
}

function mapProductToUI(p) {
  return {
    id: p._id,
    name: p.name,
    price: p.price,
    image:
      p.images && p.images.length
        ? p.images[0]
        : "https://via.placeholder.com/400x400?text=No+Image",
    rating: p.rating || 0,
    reviews: p.reviews || 0,
    isOrganic: p.isOrganic || false,
    isNew: p.isNew || false,
  };
}
