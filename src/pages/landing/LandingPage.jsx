import Hero from "../../components/marketing/Hero";
import Features from "../../components/marketing//Features";
import Pricing from "../../components/marketing/Pricing";

const LandingPage = () => {
  return (
    <div className="bg-white text-gray-800">
      <Hero />
      <Features />
      <Pricing />
    </div>
  );
};

export default LandingPage;