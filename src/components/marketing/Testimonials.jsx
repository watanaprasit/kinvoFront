import Container from "../common/Container/Container";
import Card from "../common/Card/Card";

const Testimonials = () => {
  return (
    <section className="py-20">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Loved by creators worldwide</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join millions of creators and businesses using Kinvo to grow their audience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <Card key={item}>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                <div>
                  <p className="font-medium">Creator Name</p>
                  <p className="text-sm text-gray-500">@username</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Kinvo has completely transformed how I connect with my audience. It's simple, effective, and looks amazing!"
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;