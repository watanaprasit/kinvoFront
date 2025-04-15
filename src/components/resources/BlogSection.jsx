import Container from "../common/Container/Container";
import Button from "../common/Button/index";

const BlogSection = () => {
  return (
    <section className="py-16">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="bg-purple-100 text-purple-800 text-sm font-medium px-4 py-1 rounded-full mb-6 inline-block">
              Our Insights
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-green-500">Kinvo</span> Blog
            </h1>
            <p className="text-xl text-gray-600">
              Expert tips, industry insights, and success stories
            </p>
          </div>

          <div className="mb-16">
            <img 
              alt="Kinvo blog" 
              className="rounded-xl shadow-lg w-full"
            />
          </div>

          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold mb-4">Latest Articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <span className="text-sm text-gray-500">June 15, 2024</span>
                  <h3 className="font-bold text-xl mb-2 text-green-500">Networking in a Digital Age</h3>
                  <p className="text-gray-600">Explore how digital tools are transforming professional connections and relationships.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <span className="text-sm text-gray-500">June 8, 2024</span>
                  <h3 className="font-bold text-xl mb-2 text-green-500">Building Your Personal Brand</h3>
                  <p className="text-gray-600">Learn effective strategies to establish and grow your professional identity online.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Topics We Cover</h2>
              <div className="flex flex-wrap gap-3">
                <span className="bg-gray-100 px-4 py-2 rounded-full text-gray-700">Networking</span>
                <span className="bg-gray-100 px-4 py-2 rounded-full text-gray-700">Digital Identity</span>
                <span className="bg-gray-100 px-4 py-2 rounded-full text-gray-700">Professional Growth</span>
                <span className="bg-gray-100 px-4 py-2 rounded-full text-gray-700">Career Development</span>
                <span className="bg-gray-100 px-4 py-2 rounded-full text-gray-700">Industry Trends</span>
              </div>
            </div>

            <div className="bg-purple-50 p-8 rounded-xl text-center">
              <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
              <p className="text-gray-600 mb-6">
                Get the latest insights delivered directly to your inbox.
              </p>
              <Button>Subscribe Now</Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default BlogSection;