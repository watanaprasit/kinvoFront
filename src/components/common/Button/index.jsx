// import PropTypes from 'prop-types';
// import { StyledButton } from './styles';

// const Button = ({ onClick, type = 'button', isLoading, children, className }) => {
//   return (
//     <StyledButton
//       type={type}
//       onClick={onClick}
//       disabled={isLoading}
//       className={className}
//       $isLoading={isLoading} 
//     >
//       {isLoading ? 'Loading...' : children}
//     </StyledButton>
//   );
// };

// Button.propTypes = {
//   onClick: PropTypes.func,
//   type: PropTypes.oneOf(['button', 'submit', 'reset']),
//   isLoading: PropTypes.bool,
//   className: PropTypes.string,
//   children: PropTypes.node.isRequired,
// };

// export default Button;

//old above, new without styled-components
const Button = ({ 
  children, 
  variant = "primary", 
  fullWidth = false, 
  className = "", 
  ...props 
}) => {
  const baseClasses = "font-semibold rounded-lg transition duration-200";
  const sizeClasses = "px-6 py-3";
  const widthClass = fullWidth ? "w-full" : "";
  
  const variantClasses = {
    primary: "bg-green-500 hover:bg-green-600 text-white",
    secondary: "bg-white border border-gray-300 hover:bg-gray-50 text-gray-800"
  };
  
  return (
    <button 
      className={`${baseClasses} ${sizeClasses} ${widthClass} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

