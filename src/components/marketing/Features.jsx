const Features = () => {
    const features = [
      {
        title: "Customizable Designs",
        description: "Create a unique card that fits your brand.",
        icon: "🎨",
      },
      {
        title: "Instant Sharing",
        description: "Share your card instantly via QR codes.",
        icon: "📱",
      },
      {
        title: "Analytics Dashboard",
        description: "Track views and interactions in real time.",
        icon: "📊",
      },
    ];
  
    return (
      <section className="bg-light-gray py-20 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 shadow-lg rounded-lg">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default Features;