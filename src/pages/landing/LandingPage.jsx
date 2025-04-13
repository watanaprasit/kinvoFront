import Hero from "../../components/marketing/Hero";
import Brands from "../../components/marketing/Brands";
import Features from "../../components/marketing/Features";
import UseCases from "../../components/marketing/UseCases";
import Testimonials from "../../components/marketing/Testimonials";
import Pricing from "../../components/marketing/Pricing";
import Header from "../../components/layouts/MainLayout/Header";
import Footer from "../../components/layouts/MainLayout/Footer";

const LandingPage = () => {
  return (
    <div className="bg-white text-gray-800 font-sans">
      <Header />
      <Hero />
      <Brands />
      <Features />
      <UseCases />
      <Testimonials />
      <Pricing />
      <Footer />
    </div>
  );
};

export default LandingPage;