import Container from "../common/Container/Container";
import Button from "../common/Button/index";

const AboutSection = () => {
  return (
    <section className="py-16">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="bg-purple-100 text-purple-800 text-sm font-medium px-4 py-1 rounded-full mb-6 inline-block">
              Our Story
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-green-500">Kinvo</span>
            </h1>
            <p className="text-xl text-gray-600">
              Reimagining how professionals connect in the digital world
            </p>
          </div>

          <div className="mb-16">
            <img 
              alt="Kinvo team" 
              className="rounded-xl shadow-lg w-full"
            />
          </div>

          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-600">
                At Kinvo, we believe that professional networking should be simple, elegant, and effective. 
                Our mission is to empower professionals to make meaningful connections without the 
                constraints of traditional business cards or the limitations of social platforms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2023, Kinvo was born from a simple observation: despite living in a digital world, 
                professionals were still exchanging paper business cards or fumbling with phone contacts 
                during networking events.
              </p>
              <p className="text-gray-600">
                We set out to create a solution that would make sharing your professional identity as 
                simple as sharing a link, while offering more functionality and personalization than 
                traditional business cards ever could.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Our Values</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-2 text-green-500">Simplicity</h3>
                  <p className="text-gray-600">We believe the best tools get out of your way and let you focus on what matters: building relationships.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-2 text-green-500">Innovation</h3>
                  <p className="text-gray-600">We constantly push boundaries to create solutions that make networking more efficient and effective.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-2 text-green-500">Trust</h3>
                  <p className="text-gray-600">We build everything with security and privacy in mind, ensuring your information is shared only as you intend.</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-8 rounded-xl text-center">
              <h2 className="text-2xl font-bold mb-4">Join the Kinvo Community</h2>
              <p className="text-gray-600 mb-6">
                Be part of the revolution in professional networking.
              </p>
              <Button>Get Started Today</Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutSection;