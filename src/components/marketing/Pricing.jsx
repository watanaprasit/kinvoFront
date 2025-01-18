const Pricing = () => {
    return (
      <section id="pricing" className="py-16 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-black mb-6">Pricing Plans</h2>
          <p className="text-gray-700 mb-12">
            Choose a plan that fits your needs and get started today!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Starter Plan */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-semibold text-black mb-4">Starter</h3>
              <p className="text-4xl font-bold text-black mb-4">Free</p>
              <ul className="text-gray-700 mb-6 space-y-2">
                <li>✔ Basic features</li>
                <li>✔ Access to templates</li>
                <li>✔ Email support</li>
              </ul>
              <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                Get Started
              </button>
            </div>
  
            {/* Premium Plan */}
            <div className="bg-white rounded-lg shadow-md p-8 border-2 border-gold">
              <h3 className="text-2xl font-semibold text-black mb-4">Premium</h3>
              <p className="text-4xl font-bold text-black mb-4">$9.95</p>
              <ul className="text-gray-700 mb-6 space-y-2">
                <li>✔ All Starter features</li>
                <li>✔ Advanced customization</li>
                <li>✔ Priority support</li>
              </ul>
              <button className="bg-gold-gradient text-black py-2 px-4 rounded-lg hover:shadow-md">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default Pricing;