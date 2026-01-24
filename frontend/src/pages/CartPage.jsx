import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import jsPDF from "jspdf";
import logo from "../assets/logo.jpg";
import { Helmet } from "react-helmet";

export default function CartPage() {
  const {
    cart,
    addItem,
    removeItem,
    totalAmount,
    getFinalPrice,
    isDealer,
  } = useCart();

  const navigate = useNavigate();

  const [showQuotationForm, setShowQuotationForm] = useState(false);

  const [customer, setCustomer] = useState({
    name: "",
    company: "",
    phone: "",
    address: "",
  });

  const GST = totalAmount * 0.18;
  const GRAND_TOTAL = totalAmount + GST;

  if (cart.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        <Helmet>
          <title>Cart — NWT Filtration</title>
          <meta
            name="description"
            content="Review products in your cart and generate quotations for industrial water filtration systems."
          />
        </Helmet>

        <div className="w-20 h-20 mb-6 rounded-full bg-gray-100 flex items-center justify-center text-3xl">
          🛒
        </div>

        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>

        <p className="text-gray-500 max-w-md mb-6">
          Browse our filtration products and add items to generate a quotation.
        </p>

        <button
          onClick={() => navigate("/products")}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Browse Products
        </button>
      </section>
    );
  }

  const downloadQuotation = () => {
    const doc = new jsPDF();
    let y = 15;

    // HEADER
    doc.addImage(logo, "JPG", 14, y, 30, 18);

    doc.setFontSize(16);
    doc.text("NWT Filtration", 50, y + 6);

    doc.setFontSize(10);
    doc.text(
      "Ground Floor, No 27, 2nd Main, Nanjappa Layout,\nAdugodi, Bengaluru, Karnataka - 560030",
      50,
      y + 12
    );

    doc.text(
      "Phone: 9483861000 | Email: nwtfiltration@gmail.com",
      50,
      y + 20
    );
    doc.text("GSTIN: 29AYRPA9808K1ZQ", 50, y + 24);

    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 20);
    doc.text(
      `Quotation ID: Q-NWT-${Date.now().toString().slice(-5)}`,
      150,
      26
    );

    // CUSTOMER
    y = 60;
    doc.setFontSize(11);
    doc.text("To,", 14, y);
    y += 5;

    doc.text(customer.name || "", 14, y);
    y += 5;

    doc.text(customer.company || "", 14, y);
    y += 5;

    doc.text(customer.address || "", 14, y);
    y += 5;

    doc.text(`Phone: ${customer.phone || ""}`, 14, y);

    // INTRO
    y += 10;
    doc.setFontSize(10);
    doc.text(
      "Thank you for your enquiry. Please find below our quotation for your requirement.",
      14,
      y
    );

    // TABLE HEADER
    y += 12;
    doc.text("S.No", 14, y);
    doc.text("Product Description", 30, y);
    doc.text("Qty", 130, y, { align: "right" });
    doc.text("Unit Price", 160, y, { align: "right" });
    doc.text("Amount", 195, y, { align: "right" });

    y += 2;
    doc.line(14, y, 195, y);

    // TABLE ITEMS
    y += 8;
    cart.forEach((item, index) => {
      const unit = getFinalPrice(item);
      const amount = unit * item.qty;

      doc.text(String(index + 1), 14, y);
      doc.text(item.name, 30, y, { maxWidth: 90 });
      doc.text(String(item.qty), 130, y, { align: "right" });
      doc.text(`${unit.toFixed(2)}`, 160, y, { align: "right" });
      doc.text(`${amount.toFixed(2)}`, 195, y, { align: "right" });

      y += 8;
    });

    // TOTALS
    y += 5;
    doc.line(120, y, 195, y);
    y += 6;

    doc.text("Sub Total", 140, y);
    doc.text(`${totalAmount.toFixed(2)}`, 195, y, { align: "right" });

    y += 6;
    doc.text("GST (18%)", 140, y);
    doc.text(`${GST.toFixed(2)}`, 195, y, { align: "right" });

    y += 6;
    doc.setFontSize(11);
    doc.text("Grand Total", 140, y);
    doc.text(`${GRAND_TOTAL.toFixed(2)}`, 195, y, { align: "right" });

    // ⭐ YELLOW SHIPPING NOTE BELOW TOTAL ⭐
y += 10;

// make a small yellow box on the RIGHT
const boxWidth = 95;
const boxX = 195 - boxWidth; // align to the right edge

doc.setFillColor(255, 247, 197);
doc.rect(boxX, y, boxWidth, 14, "F");

doc.setFontSize(9);
doc.text(
  "Shipping charges are extra,",
  boxX + 4,
  y + 6
);
doc.text(
  "calculated based on location.",
  boxX + 4,
  y + 11
);
    // TERMS
    y += 22;
    doc.text("Terms and Conditions", 14, y);
    y += 5;

    doc.text("• Delivery Period: 5 Days", 14, y);
    y += 5;

    doc.text("• Payment Terms: Full payment in advance", 14, y);

    // SIGNATURE
    y += 12;
    doc.text("Sincerely Yours,", 14, y);
    y += 6;
    doc.text("For NWT Filtration", 14, y);
    y += 10;
    doc.text("Authorized Signatory", 14, y);

    doc.save("nwt-quotation.pdf");
  };

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold">Shopping Cart</h2>

          {cart.map((item) => {
            const unit = getFinalPrice(item);
            const lineTotal = unit * item.qty;

            return (
              <div
                key={item.id}
                className="bg-white border rounded-xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row gap-4 md:gap-6"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 border rounded-lg bg-gray-50 flex items-center justify-center mx-auto md:mx-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-base sm:text-lg font-semibold line-clamp-2">
                    {item.name}
                  </h4>

                  {isDealer && (
                    <p className="text-green-600 text-sm mt-1">
                      Dealer Price (10% OFF)
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4">
                    <span className="text-sm">Quantity</span>

                    <div className="flex border rounded-lg overflow-hidden">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        −
                      </button>

                      <span className="px-4 py-1">{item.qty}</span>

                      <button
                        onClick={() => addItem(item)}
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-right md:text-right mt-3 md:mt-0">
                  <p className="font-semibold text-base sm:text-lg">
                    {lineTotal.toFixed(2)}
                  </p>

                  {!isDealer && (
                    <p className="text-sm text-gray-400 line-through">
                      {item.qty * item.price.original}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* SUMMARY */}
        <div className="bg-gray-50 border rounded-xl p-5 sm:p-6 h-fit sticky top-20 space-y-4">
          <h3 className="text-lg font-semibold">Order Summary</h3>

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{totalAmount.toFixed(2)}</span>
          </div>

          <div className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 p-3 rounded">
            Shipping cost will be added at checkout based on your location.
          </div>

          <div className="flex justify-between">
            <span>GST (18%)</span>
            <span>{(totalAmount * 0.18).toFixed(2)}</span>
          </div>

          <hr />

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>{GRAND_TOTAL.toFixed(2)}</span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold"
          >
            Proceed to Checkout
          </button>

          <button
            onClick={() => setShowQuotationForm(true)}
            className="w-full border border-green-600 text-green-700 py-3 rounded-lg hover:bg-green-50"
          >
            Download Quotation (PDF)
          </button>
        </div>
      </section>

      {/* QUOTATION POPUP */}
      {showQuotationForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold">Customer Details</h3>

            <input
              className="border p-2 w-full rounded"
              placeholder="Customer Name"
              value={customer.name}
              onChange={(e) =>
                setCustomer({ ...customer, name: e.target.value })
              }
            />

            <input
              className="border p-2 w-full rounded"
              placeholder="Company Name"
              value={customer.company}
              onChange={(e) =>
                setCustomer({ ...customer, company: e.target.value })
              }
            />

            <input
              className="border p-2 w-full rounded"
              placeholder="Phone Number"
              value={customer.phone}
              onChange={(e) =>
                setCustomer({ ...customer, phone: e.target.value })
              }
            />

            <textarea
              className="border p-2 w-full rounded"
              placeholder="Address"
              rows="3"
              value={customer.address}
              onChange={(e) =>
                setCustomer({ ...customer, address: e.target.value })
              }
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowQuotationForm(false)}
                className="flex-1 border py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  downloadQuotation();
                  setShowQuotationForm(false);
                }}
                className="flex-1 bg-green-600 text-white py-2 rounded"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
