import Hero from "../components/hero/Hero";
import Features from "../components/features/Features";
import PlantSystems from "../components/products/PlantSystems";
import HomeCategories from "../components/HomeCategories";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";

export default function Home() {
  return (
    <><Helmet>
    <title>NWT Filtration — Water & Industrial Filtration Systems</title>

    <meta
      name="description"
      content="Buy RO, UF, UV, SWT, WTP and industrial water treatment systems. High quality filtration solutions across India — NWT Filtration."
    />

    <meta name="keywords" content="RO Plant, Water Treatment, Industrial Filtration, NWT Filtration, UF, UV, SWT" />

    <meta property="og:title" content="NWT Filtration — Industrial Water Filtration Systems" />
    <meta property="og:description" content="Advanced water & industrial filtration systems — delivery across India." />
    <meta property="og:type" content="website" />
  </Helmet>
      <Hero />
      <Features />
      <PlantSystems />
      <HomeCategories />
      <Footer />
    </>
  );
}
