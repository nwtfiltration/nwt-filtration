import { useState, useEffect } from "react";
import products from "../data/products.json";
import { useCart } from "../context/CartContext";
import { Helmet } from "react-helmet";


const ITEMS_PER_PAGE = 12;

const AllProducts = () => {
  const [view, setView] = useState("grid");
  const [category, setCategory] = useState("ALL");
  const [subCategory, setSubCategory] = useState("ALL");
  const [subCategory2, setSubCategory2] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { cart, addItem, removeItem } = useCart();
  const token = localStorage.getItem("dealer_token");

  const getQty = (id) => cart.find((c) => c.id === id)?.qty || 0;

  useEffect(() => {
    setPage(1);
  }, [category, subCategory, subCategory2, search]);

  const categories = [
    "ALL",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  const subCategories = [
    "ALL",
    ...new Set(
      products
        .filter((p) => category === "ALL" || p.category === category)
        .map((p) => p.subCategory)
        .filter(Boolean)
    ),
  ];

  const subCategories2 = [
    "ALL",
    ...new Set(
      products
        .filter(
          (p) =>
            (category === "ALL" || p.category === category) &&
            (subCategory === "ALL" || p.subCategory === subCategory)
        )
        .map((p) => p.subCategory2)
        .filter(Boolean)
    ),
  ];

  const filtered = products.filter((p) => {
    const c = category === "ALL" || p.category === category;
    const s1 = subCategory === "ALL" || p.subCategory === subCategory;
    const s2 = subCategory2 === "ALL" || p.subCategory2 === subCategory2;
    const q = p.name.toLowerCase().includes(search.toLowerCase());
    return c && s1 && s2 && q;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const pageData = filtered.slice(start, start + ITEMS_PER_PAGE);

  return (
    <section className="px-4 sm:px-6 py-8 sm:py-10">
      <Helmet>
  <title>All Products — NWT Filtration</title>

  <meta
    name="description"
    content="Browse all RO plants, UF systems, WTP, ETP, UV disinfection and industrial filtration products."
  />
</Helmet>

      <h2 className="text-2xl font-semibold mb-6">All Products</h2>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setSubCategory("ALL");
            setSubCategory2("ALL");
          }}
          className="border px-3 py-2 rounded w-full sm:w-auto"
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

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

        {/* SEARCH becomes full width on small screens */}
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-64"
        />

        {/* VIEW TOGGLES */}
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
              className={`border p-4 rounded ${
                view === "list" ? "flex flex-col sm:flex-row gap-4 sm:gap-6" : ""
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
                  {token ? (
                    <>
                      <span className="text-green-700 font-semibold">
                        ₹{(p.price?.discounted * 0.9).toFixed(2)}
                      </span>

                      <span className="line-through text-sm ml-2 text-gray-400">
                        ₹{p.price?.discounted}
                      </span>

                      <p className="text-xs text-green-600 font-medium">
                        Dealer Price (10% OFF)
                      </p>
                    </>
                  ) : (
                    <>
                      <span className="text-green-700 font-semibold">
                        ₹{p.price?.discounted}
                      </span>

                      <span className="line-through text-sm ml-2 text-gray-400">
                        ₹{p.price?.original}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {qty === 0 ? (
                <button
                  onClick={() => addItem(p)}
                  className="mt-3 sm:mt-0 bg-green-700 text-white px-4 py-2 rounded"
                >
                  Add to cart
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
        <div className="flex justify-center gap-2 mt-8">
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

export default AllProducts;
