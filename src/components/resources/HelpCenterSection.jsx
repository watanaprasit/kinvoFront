import Container from "../common/Container/Container";
import Button from "../common/Button/index";

const HelpCenterSection = () => {
  return (
    <section className="py-16">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="bg-purple-100 text-purple-800 text-sm font-medium px-4 py-1 rounded-full mb-6 inline-block">
              Get Assistance
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-green-500">Help</span> Center
            </h1>
            <p className="text-xl text-gray-600">
              Find answers to all your questions about using Kinvo
            </p>
          </div>

          <div className="mb-16">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  className="w-full py-3 px-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <div className="absolute right-4 top-3 text-gray-400">
                  {/* Search icon placeholder */}
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold mb-4">Popular Topics</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-2 text-green-500">Getting Started</h3>
                  <p className="text-gray-600">Learn the basics of setting up your Kinvo profile and connecting with others.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-2 text-green-500">Account Settings</h3>
                  <p className="text-gray-600">Manage your account preferences, privacy settings, and notification options.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-2 text-green-500">Troubleshooting</h3>
                  <p className="text-gray-600">Find solutions to common issues and technical problems you might encounter.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-medium text-lg mb-2">How do I create a Kinvo account?</h3>
                  <p className="text-gray-600">You can sign up using your email address or connect with your Google or Apple account for a seamless experience.</p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-medium text-lg mb-2">Is my information secure?</h3>
                  <p className="text-gray-600">Yes, we use industry-standard encryption and security measures to protect your personal and professional data.</p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-medium text-lg mb-2">Can I customize my profile link?</h3>
                  <p className="text-gray-600">Absolutely! Premium users can create custom URLs for their profiles to match their personal brand.</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-8 rounded-xl text-center">
              <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
              <p className="text-gray-600 mb-6">
                Our support team is ready to assist you with any questions.
              </p>
              <Button>Contact Support</Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HelpCenterSection;