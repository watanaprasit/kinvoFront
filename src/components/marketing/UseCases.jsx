import { useState } from "react";
import Container from "../common/Container/Container";

const UseCases = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  const tabs = [
    { name: "Content Creators" },
    { name: "Musicians" },
    { name: "Small Businesses" },
  ];
  
  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">One link for all your audiences</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Kinvo works for everyone, from individual creators to global brands.
          </p>
        </div>
        
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-gray-100 rounded-lg">
            {tabs.map((tab, index) => (
              <button
                key={index}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === index 
                    ? "bg-white text-gray-800 shadow-sm" 
                    : "text-gray-600 hover:text-gray-800"
                }`}
                onClick={() => setActiveTab(index)}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h3 className="text-2xl font-bold mb-4">
              {activeTab === 0 && "Share all your content in one place"}
              {activeTab === 1 && "Connect fans to your music and merch"}
              {activeTab === 2 && "Grow your business online"}
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 0 && "Share videos, blog posts, social profiles, music, products and more. All from your Kinvo."}
              {activeTab === 1 && "Link to streaming platforms, tour dates, merchandise and exclusive content."}
              {activeTab === 2 && "Connect customers to your website, online store, booking system and social media."}
            </p>
            <ul className="space-y-3">
              {[1, 2, 3].map((item) => (
                <li key={item} className="flex items-center">
                  <span className="inline-block w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">✓</span>
                  <span>
                    {activeTab === 0 && ["Customize your profile", "Schedule and prioritize content", "Gain valuable audience insights"][item-1]}
                    {activeTab === 1 && ["Promote new releases", "Sell more tickets and merch", "Grow your fanbase"][item-1]}
                    {activeTab === 2 && ["Increase website traffic", "Boost social media following", "Drive more sales"][item-1]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="order-1 md:order-2 bg-white p-6 rounded-2xl shadow-lg">
            <img 
              src="/api/placeholder/400/600" 
              alt="Kinvo example" 
              className="w-full rounded-lg"
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default UseCases;