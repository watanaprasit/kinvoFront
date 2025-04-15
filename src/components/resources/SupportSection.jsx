import Container from "../common/Container/Container";
import Button from "../common/Button/index";

const SupportSection = () => {
  return (
    <section className="py-16">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="bg-purple-100 text-purple-800 text-sm font-medium px-4 py-1 rounded-full mb-6 inline-block">
              We Are Here To Help
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-green-500">Customer</span> Support
            </h1>
            <p className="text-xl text-gray-600">
              Get the assistance you need from our dedicated support team
            </p>
          </div>

          <div className="mb-16">
            <div className="bg-gray-50 p-8 rounded-xl">
              <h2 className="text-2xl font-bold mb-6 text-center">How Can We Help You Today?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-gray-200 p-6 rounded-lg text-center hover:border-green-500 transition-colors">
                  <div className="mb-4 text-green-500">
                    {/* Message icon placeholder */}
                    <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                    </svg>
                  </div>
                  <h3 className="font-bold text-xl mb-2">Chat Support</h3>
                  <p className="text-gray-600 mb-4">Speak with our support team in real-time</p>
                  <Button>Start Chat</Button>
                </div>
                <div className="border border-gray-200 p-6 rounded-lg text-center hover:border-green-500 transition-colors">
                  <div className="mb-4 text-green-500">
                    {/* Email icon placeholder */}
                    <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <h3 className="font-bold text-xl mb-2">Email Support</h3>
                  <p className="text-gray-600 mb-4">Send us a message and we will respond promptly</p>
                  <Button>Send Email</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold mb-4">Support Hours</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-lg mb-2">Weekdays</h3>
                    <p className="text-gray-600">9:00 AM - 8:00 PM ET</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">Weekends</h3>
                    <p className="text-gray-600">10:00 AM - 6:00 PM ET</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Quick Solutions</h2>
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-medium text-lg mb-2">Password Reset</h3>
                  <p className="text-gray-600">Need to reset your password? <a href="#" className="text-green-500 font-medium">Click here</a> to receive a reset link.</p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-medium text-lg mb-2">Account Access</h3>
                  <p className="text-gray-600">Having trouble accessing your account? <a href="#" className="text-green-500 font-medium">Try these solutions</a> first.</p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-medium text-lg mb-2">Billing Questions</h3>
                  <p className="text-gray-600">For inquiries about billing or subscriptions, <a href="#" className="text-green-500 font-medium">view our billing FAQ</a>.</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-8 rounded-xl text-center">
              <h2 className="text-2xl font-bold mb-4">Visit Our Help Center</h2>
              <p className="text-gray-600 mb-6">
                Browse our comprehensive knowledge base for tutorials and guides.
              </p>
              <Button>Explore Help Center</Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default SupportSection;