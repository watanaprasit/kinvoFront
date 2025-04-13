import Container from "../common/Container/Container";
import Button from "../common/Button/index";

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start for free, upgrade when you need more features.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold">Free</h3>
                <p className="text-gray-500">For individuals just getting started</p>
              </div>
              <span className="text-3xl font-bold">$0</span>
            </div>
            
            <ul className="space-y-4 mb-8">
              {["Basic customization", "Up to 5 links", "Mobile-friendly profile", "Limited analytics"].map((feature, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button variant="secondary" fullWidth>
              Get Started
            </Button>
          </div>
          
          {/* Premium Plan */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-green-500 p-8 relative">
            <div className="absolute top-0 right-0 transform translate-y-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
              POPULAR
            </div>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold">Premium</h3>
                <p className="text-gray-500">For creators who want more</p>
              </div>
              <span className="text-3xl font-bold">$9.95</span>
            </div>
            
            <ul className="space-y-4 mb-8">
              {[
                "Everything in Free",
                "Unlimited links",
                "Advanced customization",
                "Priority support",
                "Detailed analytics",
                "Remove Kinvo branding"
              ].map((feature, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button variant="primary" fullWidth>
              Upgrade Now
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Pricing;