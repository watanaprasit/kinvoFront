const SocialIcon = ({ platform }) => {
    return (
      <a 
        href="#" 
        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
      >
        <span className="sr-only">{platform}</span>
        {/* You could add actual social icons here */}
      </a>
    );
  };
  
  export default SocialIcon;