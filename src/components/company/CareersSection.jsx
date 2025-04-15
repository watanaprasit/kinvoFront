import Container from "../common/Container/Container";
import Button from "../common/Button/index";

const CareersSection = () => {
  const openPositions = [
    {
      title: "Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time"
    },
    {
      title: "UI/UX Designer",
      department: "Design",
      location: "San Francisco, CA",
      type: "Full-time"
    },
    {
      title: "Growth Marketing Specialist",
      department: "Marketing",
      location: "Remote",
      type: "Full-time"
    },
    {
      title: "Customer Success Manager",
      department: "Operations",
      location: "New York, NY",
      type: "Full-time"
    }
  ];

  return (
    <section className="py-16">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="bg-purple-100 text-purple-800 text-sm font-medium px-4 py-1 rounded-full mb-6 inline-block">
              Join Our Team
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Careers at <span className="text-green-500">Kinvo</span>
            </h1>
            <p className="text-xl text-gray-600">
              Help us build the future of professional networking
            </p>
          </div>

          <div className="mb-16">
            <img 
              alt="Kinvo office culture" 
              className="rounded-xl shadow-lg w-full"
            />
          </div>

          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold mb-4">Why Join Kinvo?</h2>
              <p className="text-gray-600 mb-4">
                At Kinvo, we are on a mission to transform how professionals connect and share their 
                digital identities. We are looking for passionate individuals who thrive in a fast-paced 
                environment and are eager to make an impact.
              </p>
              <p className="text-gray-600">
                As part of our team, you will work alongside talented individuals who are committed to building 
                products that millions of professionals will use daily. We value innovation, collaboration, 
                and a healthy work-life balance.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Our Benefits</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-2 text-green-500">Health & Wellness</h3>
                  <p className="text-gray-600">Comprehensive health insurance, mental health resources, and wellness stipends.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-2 text-green-500">Flexible Work</h3>
                  <p className="text-gray-600">Remote-friendly policies and flexible work schedules to accommodate your lifestyle.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-2 text-green-500">Growth Opportunities</h3>
                  <p className="text-gray-600">Professional development budget and clear career progression paths.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-2 text-green-500">Equity</h3>
                  <p className="text-gray-600">Every employee receives equity in the company, making you an owner of what we build.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Open Positions</h2>
              <div className="space-y-4">
                {openPositions.map((position, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-200">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                      <div>
                        <h3 className="font-bold text-xl text-gray-900">{position.title}</h3>
                        <p className="text-gray-600">{position.department} · {position.location} · {position.type}</p>
                      </div>
                      <Button className="mt-4 md:mt-0">Apply Now</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-purple-50 p-8 rounded-xl text-center">
              <h2 className="text-2xl font-bold mb-4">Do Not See the Right Role?</h2>
              <p className="text-gray-600 mb-6">
                We are always looking for talented individuals to join our team. Send us your resume and we will keep you in mind for future opportunities.
              </p>
              <Button>Send Your Resume</Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CareersSection;
