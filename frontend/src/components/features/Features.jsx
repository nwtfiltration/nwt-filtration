import { Truck, Percent, FileText } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "FAST & SECURE SHIPPING",
    desc: "Doorstep Deliveries Throughout India"
  },
  {
    icon: Percent,
    title: "BUY MORE SAVE MORE",
    desc: "Automated Quantity Discounts"
  },
  {
    icon: FileText,
    title: "GST SETOFF AVAILABLE",
    desc: "Claim GST Credit On All Your Order"
  }
];

export default function Features() {
  return (
    <section className="bg-gray-50 py-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition"
            >
              <f.icon className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
