import { useCart } from "../../context/CartContext";
const token = localStorage.getItem("dealer_token");

const plantProducts = [
  {
    id: 1,
    category: "PLANT SYSTEMS",
    title: "Sewage Water Treatment Plant (SWT)",
    image: "/assets/products/swt.png",
    oldPrice: "₹1,20,000",
    price: 98000
  },
  {
    id: 2,
    category: "PLANT SYSTEMS",
    title: "Effluent Treatment Plant (ETP)",
    image: "/assets/products/etp.jpg",
    oldPrice: "₹2,10,000",
    price: 178000
  },
  {
    id: 3,
    category: "PLANT SYSTEMS",
    title: "Ultra Filtration Plant (UF)",
    image: "/assets/products/uf.jpg",
    oldPrice: "₹80,000",
    price: 68000
  },
  {
    id: 4,
    category: "PLANT SYSTEMS",
    title: "RO Plant – 1000 LPH",
    image: "/assets/products/ro1000lph.jpg",
    oldPrice: "₹3,60,000",
    price: 290000
  },
  {
    id: 5,
    category: "PLANT SYSTEMS",
    title: "Water Treatment Plant (WTP)",
    image: "/assets/products/wtp.jpg",
    oldPrice: "₹2,40,000",
    price: 195000
  },
  {
    id: 6,
    category: "PLANT SYSTEMS",
    title: "Ultraviolet Difinfection Plant",
    image: "/assets/products/uv.jpg",
    oldPrice: "₹1,50,000",
    price: 120000
  }
];

export default function PlantSystems() {
  const { cart, addItem, removeItem } = useCart();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Heading */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-px bg-gray-300"></div>
          <h2 className="text-2xl font-semibold tracking-wide">
            PLANT SYSTEM PRODUCTS
          </h2>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
          {plantProducts.map((p) => {
            const item = cart.find(c => c.id === p.id);

            return (
              <div key={p.id} className="relative">

                {/* Sale Badge */}
                <span className="absolute top-3 left-3 z-10 border border-green-500 text-green-600 text-xs px-2 py-1">
                  Sale!
                </span>

                {/* Image */}
                <div className="h-64 flex items-center justify-center">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="max-h-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-gray-500 uppercase">
                    {p.category}
                  </p>

                  <h3 className="text-sm font-medium leading-snug hover:text-green-600 cursor-pointer">
                    {p.title}
                  </h3>

                  {/* Rating (UI only) */}
                  <div className="flex text-orange-400 text-sm">
                    ★★★★★
                  </div>

                  {/* Price */}
                  <div className="flex flex-col gap-1">
  {token ? (
    <>
      <div className="flex items-center gap-3">
        <span className="font-bold text-green-700">
          ₹{(p.price * 0.9).toLocaleString()}
        </span>

        <span className="line-through text-gray-400 text-sm">
          ₹{p.price.toLocaleString()}
        </span>
      </div>

      <span className="text-xs text-green-600 font-medium">
        Dealer Price (10% OFF)
      </span>
    </>
  ) : (
    <div className="flex items-center gap-3">
      <span className="line-through text-gray-400 text-sm">
        {p.oldPrice}
      </span>

      <span className="font-bold">
        ₹{p.price.toLocaleString()}
      </span>
    </div>
  )}
</div>
  

                  {/* Cart Controls */}
                  {!item ? (
  <button
    onClick={() =>
      addItem({
        ...p,
        price: {
          original: p.oldPrice.replace(/[^0-9]/g, ""),
          discounted: p.price
        }
      })
    }
    className="mt-3 border border-green-600 text-green-600 px-5 py-2 text-sm hover:bg-green-600 hover:text-white transition"
  >
    ADD TO CART
  </button>
) : (
  <div className="mt-3 flex items-center gap-4">
    <button
      onClick={() => removeItem(p.id)}
      className="w-8 h-8 border text-lg"
    >
      −
    </button>

    <span className="font-semibold">{item.qty}</span>

    <button
      onClick={() =>
        addItem({
          ...p,
          price: {
            original: p.oldPrice.replace(/[^0-9]/g, ""),
            discounted: p.price
          }
        })
      }
      className="w-8 h-8 border text-lg"
    >
      +
    </button>
  </div>
)}

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
