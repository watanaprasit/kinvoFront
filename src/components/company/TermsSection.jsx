import Container from "../common/Container/Container";

const TermsSection = () => {
  return (
    <section className="py-16">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-gray-600">
              Last updated: April 15, 2025
            </p>
          </div>

          <div className="prose max-w-none text-gray-700">
            <p>
              Welcome to Kinvo. Please read these Terms of Service Terms carefully as they contain important 
              information regarding your legal rights, remedies, and obligations. By accessing or using the Kinvo 
              platform, you agree to comply with and be bound by these Terms.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              By registering for and/or using Kinvo in any manner, you agree to these Terms and all other 
              operating rules, policies, and procedures that may be published by Kinvo from time to time.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">2. Changes to Terms</h2>
            <p>
              Kinvo reserves the right to modify these Terms at any time. We will provide notice of significant 
              changes by posting the new Terms on our website and updating the Last Updated date. Your continued 
              use of Kinvo after any such changes constitutes your acceptance of the new Terms.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">3. Account Registration</h2>
            <p>
              To use certain features of Kinvo, you must register for an account. When you register, you agree to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your account and password</li>
              <li>Accept responsibility for all activities that occur under your account</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">4. User Content</h2>
            <p>
              You retain ownership of any content you submit, post, or display on or through Kinvo User Content. 
              By providing User Content, you grant Kinvo a worldwide, non-exclusive, royalty-free license to use, 
              reproduce, modify, adapt, publish, translate, distribute, and display such User Content for the purpose 
              of providing and promoting the Kinvo service.
            </p>
            <p>
              You represent and warrant that:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>You own or have the necessary rights to use and authorize Kinvo to use your User Content</li>
              <li>Your User Content does not violate any intellectual property rights or other rights of any third party</li>
              <li>Your User Content does not violate any applicable laws or regulations</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">5. Prohibited Activities</h2>
            <p>
              You agree not to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Use Kinvo for any illegal purpose or in violation of any laws</li>
              <li>Post or transmit content that is unlawful, offensive, threatening, libelous, defamatory, or otherwise objectionable</li>
              <li>Attempt to interfere with, compromise the system integrity or security, or decipher any transmissions to or from the servers running Kinvo</li>
              <li>Upload or distribute viruses, malware, or other malicious code</li>
              <li>Impersonate another person or entity</li>
              <li>Collect or harvest any personally identifiable information from Kinvo</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">6. Subscription and Payment</h2>
            <p>
              Certain features of Kinvo may require a subscription. By subscribing to a paid plan, you agree to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Pay all fees and charges associated with your account on a timely basis</li>
              <li>Provide Kinvo with a valid payment method for recurring billing</li>
              <li>Be responsible for any applicable taxes</li>
            </ul>
            <p>
              Subscriptions automatically renew unless canceled before the renewal date. Refunds are provided in 
              accordance with our Refund Policy.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">7. Termination</h2>
            <p>
              Kinvo reserves the right to suspend or terminate your account and access to the service at any time for 
              violation of these Terms or for any other reason. You may terminate your account at any time by following 
              the instructions on the Kinvo website.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">8. Disclaimer of Warranties</h2>
            <p>
              Kinvo is provided as is and as available without any warranties of any kind, either express or 
              implied, including but not limited to warranties of merchantability, fitness for a particular purpose, 
              or non-infringement.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">9. Limitation of Liability</h2>
            <p>
              In no event shall Kinvo, its directors, employees, partners, agents, suppliers, or affiliates be 
              liable for any indirect, incidental, special, consequential, or punitive damages, including without 
              limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your 
              access to or use of or inability to access or use Kinvo.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">10. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of California, 
              without regard to its conflict of law principles.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">11. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> legal@kinvo.com<br />
              <strong>Address:</strong> 123 Business Ave, Suite 100, San Francisco, CA 94107
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default TermsSection;