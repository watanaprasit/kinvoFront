import Container from "../common/Container/Container";

const PrivacySection = () => {
  return (
    <section className="py-16">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-gray-600">
              Last updated: April 15, 2025
            </p>
          </div>

          <div className="prose max-w-none text-gray-700">
            <p>
              At Kinvo, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
              disclose, and safeguard your information when you use our digital business card platform.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Information We Collect</h2>
            
            <h3 className="text-xl font-bold mt-6 mb-3">Personal Information</h3>
            <p>
              We may collect personal information that you voluntarily provide to us when you register for 
              Kinvo, express interest in obtaining information about us or our products, or otherwise contact us.
              The personal information we collect may include:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Job title and company</li>
              <li>Profile photo</li>
              <li>Social media handles</li>
              <li>Professional biography</li>
              <li>Any other information you choose to include in your digital business card</li>
            </ul>

            <h3 className="text-xl font-bold mt-6 mb-3">Usage Data</h3>
            <p>
              We may also collect information about how the Kinvo platform is accessed and used. This usage data 
              may include:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Your device IP address</li>
              <li>Browser type and version</li>
              <li>Pages of our platform that you visit</li>
              <li>The time and date of your visit</li>
              <li>The time spent on those pages</li>
              <li>Other diagnostic data</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">How We Use Your Information</h2>
            <p>
              We may use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Providing and maintaining our service</li>
              <li>Allowing you to create and share your digital business card</li>
              <li>Notifying you when someone views your profile or connects with you</li>
              <li>Improving our platform and user experience</li>
              <li>Communicating with you about updates or changes to our services</li>
              <li>Providing customer support</li>
              <li>Analyzing usage patterns to enhance our platform</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Sharing Your Information</h2>
            <p>
              We may share information we have collected about you in certain situations, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>With other users when you choose to share your digital business card</li>
              <li>With service providers who perform services on our behalf</li>
              <li>To comply with legal obligations</li>
              <li>To protect and defend our rights and property</li>
              <li>With your consent or at your direction</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Your Privacy Choices</h2>
            <p>
              You can update or delete your information at any time through your account settings. You may also 
              contact us directly to request access to, correct, or delete any personal information that you have 
              provided to us.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Security</h2>
            <p>
              We use administrative, technical, and physical security measures to protect your personal information. 
              However, no data transmission over the Internet or storage system can be guaranteed to be 100% secure.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the 
              new Privacy Policy on this page and updating the Last Updated date.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
            <p>
              If you have questions or concerns about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> privacy@kinvo.com<br />
              <strong>Address:</strong> 123 Business Ave, Suite 100, San Francisco, CA 94107
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default PrivacySection;