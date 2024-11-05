export const Button = ({ type, onClick, disabled, children, color }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`relative overflow-hidden px-5 py-2.5 rounded-[47px] bg-primary-gradient 
      flex items-center justify-center
      transition-all duration-300
      hover:scale-105 
      hover:shadow-[0_0_20px_rgba(26,133,186,0.4)]
      active:scale-95
      group`}
    >
      {/* Button text */}

      {/* Shine effect */}
      <div
        className="absolute inset-0 -translate-x-full group-hover:translate-x-full 
        transition-transform duration-700 bg-gradient-to-r from-transparent 
        via-white/20 to-transparent"
      />

      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-[47px] bg-primary-gradient opacity-0 
        blur-xl transition-opacity group-hover:opacity-50"
      />

      {children}
    </button>
  );
};
