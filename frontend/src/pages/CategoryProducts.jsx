import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import products from "../data/products.json";
import { useCart } from "../context/CartContext";

const ITEMS_PER_PAGE = 12;

const CategoryProducts = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [view, setView] = useState("grid");
  const [subCategory, setSubCategory] = useState("ALL");
  const [subCategory2, setSubCategory2] = useState("ALL");
  const [page, setPage] = useState(1);

  const { cart, addItem, removeItem } = useCart();

  const getQty = (id) => cart.find((c) => c.id === id)?.qty || 0;

  const categoryName = slug.replaceAll("-", " ").toUpperCase();

  const categoryProducts = products.filter(
    (p) => p.category === categoryName
  );

  useEffect(() => {
    setPage(1);
  }, [subCategory, subCategory2, slug]);

  const subCategories = [
    "ALL",
    ...new Set(
      categoryProducts.map((p) => p.subCategory).filter(Boolean)
    ),
  ];

  const subCategories2 = [
    "ALL",
    ...new Set(
      categoryProducts
        .filter(
          (p) => subCategory === "ALL" || p.subCategory === subCategory
        )
        .map((p) => p.subCategory2)
        .filter(Boolean)
    ),
  ];

  const filtered = categoryProducts.filter((p) => {
    const s1 = subCategory === "ALL" || p.subCategory === subCategory;
    const s2 = subCategory2 === "ALL" || p.subCategory2 === subCategory2;
    return s1 && s2;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const pageData = filtered.slice(start, start + ITEMS_PER_PAGE);

  return (
    <section className="px-4 sm:px-6 py-8 sm:py-10">
      {/* TOP BAR */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-semibold uppercase">
            {categoryName}
          </h2>
          <p className="text-sm text-gray-500">
            {filtered.length} products
          </p>
        </div>

        <button
          onClick={() => navigate("/products")}
          className="text-sm border px-4 py-2 rounded hover:bg-gray-100 self-start md:self-auto"
        >
          View All Products
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={subCategory}
          onChange={(e) => {
            setSubCategory(e.target.value);
            setSubCategory2("ALL");
          }}
          className="border px-3 py-2 rounded w-full sm:w-auto"
        >
          {subCategories.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <select
          value={subCategory2}
          onChange={(e) => setSubCategory2(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-auto"
        >
          {subCategories2.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <div className="ml-auto flex gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setView("grid")}
            className={`px-3 py-2 border rounded ${
              view === "grid" && "bg-green-700 text-white"
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setView("list")}
            className={`px-3 py-2 border rounded ${
              view === "list" && "bg-green-700 text-white"
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* PRODUCTS */}
      <div
        className={
          view === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            : "space-y-4"
        }
      >
        {pageData.map((p) => {
          const qty = getQty(p.id);

          return (
            <div
              key={p.id}
              className={`border p-4 rounded hover:shadow ${
                view === "list"
                  ? "flex flex-col sm:flex-row gap-4 sm:gap-6"
                  : ""
              }`}
            >
              <img
                src={p.image}
                alt={p.name}
                className={
                  view === "grid"
                    ? "h-40 mx-auto mb-3 object-contain"
                    : "w-24 h-24 object-contain mx-auto sm:mx-0"
                }
              />

              <div className={view === "list" ? "flex-1" : ""}>
                <h4 className="text-sm font-medium">{p.name}</h4>

                <div className="my-2">
                  <span className="text-green-700 font-semibold">
                    ₹{p.price?.discounted}
                  </span>
                  <span className="line-through text-sm ml-2 text-gray-400">
                    ₹{p.price?.original}
                  </span>
                </div>
              </div>

              {qty === 0 ? (
                <button
                  onClick={() => addItem(p)}
                  className="mt-3 sm:mt-0 bg-green-700 text-white px-4 py-2 rounded"
                >
                  Add
                </button>
              ) : (
                <div className="mt-3 sm:mt-0 flex gap-3 items-center">
                  <button onClick={() => removeItem(p.id)}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => addItem(p)}>+</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                page === i + 1 && "bg-green-700 text-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default CategoryProducts;
