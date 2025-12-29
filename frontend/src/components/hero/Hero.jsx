import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

import swt from "../../assets/hero/swt.png";
import uf from "../../assets/hero/uf.jpg";
import uv from "../../assets/hero/uv.jpg";
import etp from "../../assets/hero/etp.jpg";
import ro from "../../assets/hero/ro1000lph.jpg";
import wtp from "../../assets/hero/wtp.jpg";

const slides = [
  {
    image: swt,
    title: "Sewage Water Treatment Plant (SWT)",
    desc: "Advanced sewage water treatment solutions for industrial and municipal use."
  },
  {
    image: uf,
    title: "UltraFiltration Plant (UF)",
    desc: "Ultrafiltration systems for high-quality water purification."
  },
  {
    image: uv,
    title: "Ultraviolet Disinfection Plant (UV)",
    desc: "UV disinfection systems ensuring bacteria-free water."
  },
  {
    image: etp,
    title: "Effluent Treatment Plant (ETP)",
    desc: "Effluent treatment plants designed for industrial wastewater."
  },
  {
    image: ro,
    title: "RO Plant – 1000 LPH",
    desc: "High-performance RO system for commercial applications."
  },
  {
    image: wtp,
    title: "Water Treatment Plant (WTP)",
    desc: "Complete water treatment solutions for large-scale supply."
  }
];

export default function Hero() {
  return (
    <section className="w-full h-[70vh] md:h-[85vh]">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        loop={true}
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="w-full h-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black/50" />

              <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4 sm:px-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
                  {slide.title}
                </h1>

                <p className="max-w-2xl text-base sm:text-lg md:text-xl drop-shadow">
                  {slide.desc}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
