import Hero from "../../components/marketing/Hero";
import Brands from "../../components/marketing/Brands";
import Features from "../../components/marketing/Features";
import UseCases from "../../components/marketing/UseCases";
import Testimonials from "../../components/marketing/Testimonials";
import Pricing from "../../components/marketing/Pricing";
import Header from "../../components/layouts/MainLayout/Header";
import Footer from "../../components/layouts/MainLayout/Footer";
import Section from "../../components/layouts/MainLayout/Section";

const LandingPage = () => {
  return (
    <div className="min-h-screen w-full bg-white text-gray-800 font-sans">
      <Header />
      <main className="w-full">
        <Section background="gradient" fullWidth={true}>
          <div className="max-w-6xl mx-auto px-4">
            <Hero />
          </div>
        </Section>
        
        <Section background="white" fullWidth={true}>
          <div className="max-w-6xl mx-auto px-4">
            <Brands />
          </div>
        </Section>
        
        <Section background="gray" fullWidth={true}>
          <div className="max-w-6xl mx-auto px-4">
            <Features />
          </div>
        </Section>
        
        <Section background="white" fullWidth={true}>
          <div className="max-w-6xl mx-auto px-4">
            <UseCases />
          </div>
        </Section>
        
        <Section background="gradient" fullWidth={true}>
          <div className="max-w-6xl mx-auto px-4">
            <Testimonials />
          </div>
        </Section>
        
        <Section background="gray" fullWidth={true}>
          <div className="max-w-6xl mx-auto px-4">
            <Pricing />
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;