import Hero from "../components/hero/Hero";
import Features from "../components/features/Features";
import PlantSystems from "../components/products/PlantSystems";
import HomeCategories from "../components/HomeCategories";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <PlantSystems />
      <HomeCategories />
      <Footer />
    </>
  );
}
