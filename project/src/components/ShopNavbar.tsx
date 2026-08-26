import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ShoppingBag, Star, User as UserIcon, ShieldCheck, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/Logo';
import LanguageToggle from '@/components/LanguageToggle';
import { useCart } from '@/contexts/CartContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export default function ShopNavbar() {
  const { totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#07020f]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Logo size="sm" showText={true} />
        </Link>
        <Badge className="hidden md:inline-flex bg-amber-500/10 text-amber-300 border-amber-500/30 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 ml-2">
          Atelier D2C
        </Badge>
      </div>

      {/* Navigation Links */}
      <nav className="flex items-center gap-1.5 sm:gap-3">
        <div className="hidden lg:flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-amber-400 hover:text-amber-300 hover:bg-white/5 text-xs sm:text-sm flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Free Tools
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#150f26] border-white/10 text-white w-56 p-1">
              <DropdownMenuItem onClick={() => navigate('/find-my-vibration')} className="cursor-pointer hover:bg-white/10 flex items-center gap-2 py-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="font-semibold text-xs text-amber-300">Find Mulank by DOB</div>
                  <div className="text-[10px] text-gray-400">Unlock Free ₹999 report</div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/name-analyzer')} className="cursor-pointer hover:bg-white/10 flex items-center gap-2 py-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="font-semibold text-xs">Name Vibration Matcher</div>
                  <div className="text-[10px] text-gray-400">Real-time vibration score</div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/lucky-number-checker')} className="cursor-pointer hover:bg-white/10 flex items-center gap-2 py-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-semibold text-xs">Vehicle / House Number</div>
                  <div className="text-[10px] text-gray-400">DOB asset compatibility</div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/shop">
            <Button size="sm" className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-semibold text-xs sm:text-sm flex items-center gap-1.5 px-3.5 rounded-xl shadow-md shadow-amber-500/20">
              <ShoppingBag className="w-3.5 h-3.5" />
              Atelier Store
            </Button>
          </Link>

          <Link to="/reports">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/5 text-xs sm:text-sm">
              Reports
            </Button>
          </Link>

          <Link to="/pricing">
            <Button variant="ghost" size="sm" className="text-amber-400 hover:text-amber-300 hover:bg-white/5 text-xs sm:text-sm flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              Plans
            </Button>
          </Link>
        </div>

        {/* Dynamic Shopping Bag Button */}
        <Link to="/checkout" className="relative p-2 text-slate-300 hover:text-amber-300 transition-colors">
          <ShoppingBag className="w-5 h-5 text-amber-300" />
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-amber-400 text-black font-bold text-[10px] flex items-center justify-center animate-in zoom-in">
              {totalItems}
            </span>
          )}
        </Link>

        <LanguageToggle />

        <Link to="/find-my-vibration" className="hidden sm:inline-flex">
          <Button variant="outline" size="sm" className="border-amber-400/30 text-amber-300 hover:bg-amber-400/10 text-xs rounded-xl">
            Find My Mulank →
          </Button>
        </Link>
      </nav>
    </header>
  );
}
