const Container = ({ children, className = "", fullWidth = false }) => {
  return (
    <div className={`w-full ${fullWidth ? "" : "max-w-6xl mx-auto px-4"} ${className}`}>
      {children}
    </div>
  );
};

export default Container;