import Container from "../../common/Container/Container";

const Section = ({ 
  children, 
  className = "", 
  background = "white", 
  spacing = "normal",
  fullWidth = false
}) => {
  const bgClasses = {
    white: "bg-white",
    gray: "bg-gray-50",
    gradient: "bg-gradient-to-r from-purple-100 to-blue-50"
  };
  
  const spacingClasses = {
    normal: "py-16",
    large: "py-20",
    small: "py-10"
  };
  
  return (
    <section className={`w-full ${bgClasses[background]} ${spacingClasses[spacing]} ${className}`}>
      <Container fullWidth={fullWidth}>
        {children}
      </Container>
    </section>
  );
};

export default Section;