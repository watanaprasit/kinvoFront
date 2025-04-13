import Container from "../../common/Container/Container";
import SocialIcon from "../../common/SocialIcon/SocialIcon";

const Footer = () => {
  const footerLinks = [
    {
      title: "Product",
      links: ["Features", "Pricing", "Templates", "Enterprise"]
    },
    {
      title: "Resources",
      links: ["Blog", "Help Center", "Support", "API"]
    },
    {
      title: "Company",
      links: ["About", "Careers", "Privacy", "Terms"]
    }
  ];
  
  return (
    <footer className="bg-white pt-16 pb-12 border-t border-gray-100">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <h3 className="text-xl font-bold mb-4">Kinvo</h3>
            <p className="text-gray-600 mb-6">
              The premium digital business card solution for modern professionals.
            </p>
            <div className="flex space-x-4">
              {['twitter', 'facebook', 'instagram', 'linkedin'].map((platform) => (
                <SocialIcon key={platform} platform={platform} />
              ))}
            </div>
          </div>
          
          {footerLinks.map((column, i) => (
            <div key={i}>
              <h4 className="font-medium text-gray-900 mb-4">{column.title}</h4>
              <ul className="space-y-2">
                {column.links.map((link, j) => (
                  <li key={j}>
                    <a href="#" className="text-gray-600 hover:text-gray-900">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2025 Kinvo. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <select className="bg-gray-100 rounded-lg py-2 px-3 text-sm">
              <option>English (US)</option>
            </select>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;