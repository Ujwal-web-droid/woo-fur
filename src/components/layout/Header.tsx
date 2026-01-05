import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Heart } from "lucide-react";
import wooFurLogo from "@/assets/woo-fur-logo.png";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserMenu } from "@/components/auth/UserMenu";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Animals", path: "/animals" },
  { name: "Programs", path: "/programs" },
  { name: "Stories", path: "/stories" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-app">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src={wooFurLogo} 
              alt="Woo-Fur Logo" 
              className="h-10 w-10 rounded-full transition-transform group-hover:scale-110"
            />
            <span className="font-heading text-xl font-bold text-foreground">
              Woo-Fur
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === link.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons & User Menu */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/support">
              <Button variant="outline" size="sm" className="gap-2">
                <Heart className="h-4 w-4" />
                Donate
              </Button>
            </Link>
            <Link to="/booking">
              <Button size="sm">Book a Visit</Button>
            </Link>
            <UserMenu />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <nav className="container-app py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === link.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
              <Link to="/support" className="flex-1">
                <Button variant="outline" className="w-full gap-2">
                  <Heart className="h-4 w-4" />
                  Donate
                </Button>
              </Link>
              <Link to="/booking" className="flex-1">
                <Button className="w-full">Book a Visit</Button>
              </Link>
            </div>
            <div className="flex justify-center mt-4">
              <UserMenu />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
