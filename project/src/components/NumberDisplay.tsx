interface NumberDisplayProps {
  number: number;
  label: string;
  highlight?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const NumberDisplay = ({ number, label, highlight = false, size = 'md' }: NumberDisplayProps) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20 md:w-24 md:h-24',
    lg: 'w-28 h-28 md:w-32 md:h-32',
  };

  const numberSizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl md:text-4xl',
    lg: 'text-4xl md:text-5xl',
  };

  const labelSizeClasses = {
    sm: 'text-xs',
    md: 'text-xs md:text-sm',
    lg: 'text-sm md:text-base',
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        className={`${sizeClasses[size]} rounded-2xl flex items-center justify-center transition-all duration-300 ${
          highlight 
            ? 'bg-gradient-to-br from-gold-dark via-gold to-gold-light shadow-lg animate-glow-pulse' 
            : 'card-mystical border border-gold/20 hover:border-gold/40'
        }`}
      >
        <span 
          className={`font-display font-semibold ${numberSizeClasses[size]} ${
            highlight ? 'text-midnight' : 'text-gold'
          }`}
        >
          {number}
        </span>
      </div>
      <span className={`mt-2 ${labelSizeClasses[size]} text-muted-foreground text-center`}>
        {label}
      </span>
    </div>
  );
};

export default NumberDisplay;
