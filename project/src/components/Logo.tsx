import * as React from "react";
import { Sparkles, Sun, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

export const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  ({ size = "md", showText = true, className, ...rest }, ref) => {
    const sizeClasses = {
      sm: "w-8 h-8",
      md: "w-11 h-11",
      lg: "w-16 h-16",
      xl: "w-24 h-24",
    };

    const iconSizes = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-8 h-8",
      xl: "w-12 h-12",
    };

    const textSizes = {
      sm: "text-lg",
      md: "text-2xl",
      lg: "text-3xl",
      xl: "text-5xl",
    };

    return (
      <div ref={ref} className={cn("flex items-center gap-2.5 group cursor-pointer select-none", className)} {...rest}>
        {/* Sacred Geometry Yantra Emblem */}
        <div className="relative shrink-0">
          <div
            className={cn(
              "rounded-2xl bg-gradient-to-br from-amber-400 via-violet-600 to-amber-500 p-0.5 shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all duration-300",
              sizeClasses[size]
            )}
          >
            <div className="w-full h-full rounded-[14px] bg-[#0d071b] flex items-center justify-center relative overflow-hidden">
              {/* Inner sacred radial glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-violet-500/20 to-transparent opacity-80" />

              {/* 8-pointed golden yantra star backplate */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30 animate-spin-slow">
                <div className="w-full h-full border border-amber-400/40 rotate-45 rounded-lg" />
              </div>

              {/* Center icon */}
              <div className="relative z-10 flex items-center justify-center">
                <Sun className={cn("text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]", iconSizes[size])} />
                <Sparkles className="w-2.5 h-2.5 text-white absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>
          </div>
          <div className={cn("absolute inset-0 rounded-2xl bg-amber-400/25 blur-lg opacity-40 group-hover:opacity-75 transition-opacity pointer-events-none", sizeClasses[size])} />
        </div>

        {/* Text Logo */}
        {showText && (
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className={cn("font-display font-extrabold tracking-tight leading-none", textSizes[size])}>
                <span className="text-white">Ank</span>
                <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(245,158,11,0.3)]">Jyotish</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 uppercase tracking-widest leading-none">
                AI
              </span>
            </div>
            {size !== "sm" && (
              <span className="text-[11px] font-medium text-purple-300/70 tracking-widest uppercase mt-0.5">
                Vedic Numerology AI
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);
Logo.displayName = "Logo";

export default Logo;
