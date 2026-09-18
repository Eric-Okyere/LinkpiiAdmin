const Container = ({ children, className = '' }) => (
  <div className={`mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

export default Container;
