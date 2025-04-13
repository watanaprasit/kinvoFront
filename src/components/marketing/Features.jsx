import { Globe, Zap, BarChart3 } from "lucide-react";
import Container from "../common/Container/Container";
import Card from "../common/Card/Card";

const Features = () => {
  const features = [
    {
      title: "One link for everything",
      description: "Share your Kinvo anywhere to send followers to your entire online world.",
      icon: <Globe className="w-10 h-10 text-green-500" />,
    },
    {
      title: "Fast and easy setup",
      description: "Set up your Kinvo in minutes. No design skills needed.",
      icon: <Zap className="w-10 h-10 text-green-500" />,
    },
    {
      title: "Detailed analytics",
      description: "Track views and interactions to understand what content performs best.",
      icon: <BarChart3 className="w-10 h-10 text-green-500" />,
    },
  ];

  return (
    <section className="py-20">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why creators love Kinvo</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join millions of creators and businesses using Kinvo to share everything they create, curate and sell online.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <Card key={index} className="flex flex-col items-center text-center">
              <div className="mb-6 p-3 bg-green-50 rounded-2xl">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Features;