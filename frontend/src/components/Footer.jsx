import {
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  MessageCircle
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-2">

        {/* ABOUT */}
        <div id="about">
          <h3 className="text-white text-2xl font-semibold mb-4">
            About NWT Filtration
          </h3>

          <p className="text-sm leading-relaxed mb-4">
            We design reliable, long-lasting water treatment systems —
            from RO Plants to Industrial ETP, WTP, UF and UV solutions.
            Our mission is simple:
          </p>

          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="text-green-500" size={18} />
              100% quality-tested systems
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="text-green-500" size={18} />
              Affordable pricing with honest guidance
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="text-green-500" size={18} />
              Technical support even after installation
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div id="contact">
          <h3 className="text-white text-2xl font-semibold mb-4">
            Contact Us
          </h3>

          <div className="space-y-3 mb-6 text-sm">
            <p className="flex items-center gap-2">
              <Phone size={18} className="text-green-400" />
              +91 94838 61000
            </p>

            <p className="flex items-center gap-2">
              <Mail size={18} className="text-green-400" />
              nwtfiltration@gmail.com
            </p>

            <p className="flex items-center gap-2">
              <MapPin size={18} className="text-green-400" />
              Ground Floor, No 27, 2nd Main, Nanjappa Layout,
              Adugodi, Bengaluru — 560030
            </p>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-wrap gap-3">
            <a
              href="tel:+919483861000"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              Call Us
            </a>

            <a
              href="https://wa.me/919483861000"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 border border-green-500 text-green-400 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-500/10 transition"
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 text-center text-xs py-4">
        © {new Date().getFullYear()} NWT Filtration — All rights reserved.
      </div>
    </footer>
  );
}
