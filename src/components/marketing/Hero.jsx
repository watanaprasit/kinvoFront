import Container from "../common/Container/Container";
import Button from "../common/Button/index";

const Hero = () => {
  return (
    <section className="pt-20 pb-16">
      <Container>
        <div className="flex flex-col items-center text-center">
          <span className="bg-purple-100 text-purple-800 text-sm font-medium px-4 py-1 rounded-full mb-6">
            Everything you are. In one simple link
          </span>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            The Only Link You Will <span className="text-green-500">Ever Need</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mb-8">
            Connect your audience to everything you share, create and sell online.
            All from the one link in bio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <input
              type="email"
              placeholder="yourname"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Button>Claim your Kinvo</Button>
          </div>
        </div>
        
        <div className="mt-16 relative">
          <div className="bg-gradient-to-b from-purple-100 to-blue-50 rounded-2xl p-4 md:p-8 shadow-lg">
            <img 
              src="/api/placeholder/800/450" 
              alt="Kinvo dashboard preview" 
              className="rounded-lg shadow-md w-full"
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;