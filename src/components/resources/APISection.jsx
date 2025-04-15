import Container from "../common/Container/Container";
import Button from "../common/Button/index";

const APISection = () => {
  return (
    <section className="py-16">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="bg-purple-100 text-purple-800 text-sm font-medium px-4 py-1 rounded-full mb-6 inline-block">
              Developer Resources
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-green-500">Kinvo</span> API
            </h1>
            <p className="text-xl text-gray-600">
              Integrate Kinvo powerful features directly into your applications
            </p>
          </div>

          <div className="mb-16">
            <div className="bg-gray-900 text-white p-6 rounded-xl font-mono text-sm">
              <p className="text-green-400">Example API request</p>
 
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold mb-4">API Features</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-2 text-green-500">Profile Management</h3>
                  <p className="text-gray-600">Create, read, update, and delete user profiles programmatically.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-2 text-green-500">Connection Analytics</h3>
                  <p className="text-gray-600">Track engagement metrics and connection insights with detailed reporting.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-2 text-green-500">Webhook Events</h3>
                  <p className="text-gray-600">Subscribe to real-time notifications for important user activities.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-2 text-green-500">1. Register for API Access</h3>
                  <p className="text-gray-600">Sign up for a developer account and create your first API key in the dashboard.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-2 text-green-500">2. Explore the Documentation</h3>
                  <p className="text-gray-600">Read our comprehensive guides and reference materials to understand the API capabilities.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-2 text-green-500">3. Start Building</h3>
                  <p className="text-gray-600">Use our SDKs and sample code to quickly integrate Kinvo into your applications.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">API Documentation</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-gray-200 p-6 rounded-lg hover:border-green-500 transition-colors">
                  <h3 className="font-bold text-xl mb-2">REST API Reference</h3>
                  <p className="text-gray-600 mb-4">Complete reference for all API endpoints with examples and response schemas.</p>
                  <Button>View Documentation</Button>
                </div>
                <div className="border border-gray-200 p-6 rounded-lg hover:border-green-500 transition-colors">
                  <h3 className="font-bold text-xl mb-2">SDK Libraries</h3>
                  <p className="text-gray-600 mb-4">Official client libraries for JavaScript, Python, Ruby, and more.</p>
                  <Button>Download SDKs</Button>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-8 rounded-xl text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-gray-600 mb-6">
                Create your developer account and start building with the Kinvo API today.
              </p>
              <Button>Register for API Access</Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default APISection;