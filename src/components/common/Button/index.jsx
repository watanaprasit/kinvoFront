const Button = ({ 
  children, 
  variant = "primary", 
  fullWidth = false,
  isLoading = false, 
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
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : children}
    </button>
  );
};

export default Button;