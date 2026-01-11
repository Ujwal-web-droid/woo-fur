import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Heart } from "lucide-react";
import wooFurLogo from "@/assets/woo-fur-logo.png";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserMenu } from "@/components/auth/UserMenu";
import { usePageContent } from "@/hooks/usePageContent";

interface NavItem {
  name: string;
  path: string;
}

interface NavigationContent {
  items: NavItem[];
}

interface CTAContent {
  donateText: string;
  bookText: string;
  donatePath: string;
  bookPath: string;
}

interface BrandContent {
  name: string;
  logoAlt: string;
}

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { getSection } = usePageContent('header');

  const navigation = getSection<NavigationContent>('navigation', {
    items: [
      { name: "Home", path: "/" },
      { name: "Animals", path: "/animals" },
      { name: "Programs", path: "/programs" },
      { name: "Stories", path: "/stories" },
      { name: "About", path: "/about" },
      { name: "Contact", path: "/contact" },
    ]
  });

  const cta = getSection<CTAContent>('cta', {
    donateText: "Donate",
    bookText: "Book a Visit",
    donatePath: "/support",
    bookPath: "/booking"
  });

  const brand = getSection<BrandContent>('brand', {
    name: "Woo-Fur",
    logoAlt: "Woo-Fur Logo"
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-app">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src={wooFurLogo} 
              alt={brand.logoAlt} 
              className="h-10 w-10 rounded-full transition-transform group-hover:scale-110"
            />
            <span className="font-heading text-xl font-bold text-foreground">
              {brand.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.items.map((link) => (
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
            <Link to={cta.donatePath}>
              <Button variant="outline" size="sm" className="gap-2">
                <Heart className="h-4 w-4" />
                {cta.donateText}
              </Button>
            </Link>
            <Link to={cta.bookPath}>
              <Button size="sm">{cta.bookText}</Button>
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
            {navigation.items.map((link) => (
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
              <Link to={cta.donatePath} className="flex-1">
                <Button variant="outline" className="w-full gap-2">
                  <Heart className="h-4 w-4" />
                  {cta.donateText}
                </Button>
              </Link>
              <Link to={cta.bookPath} className="flex-1">
                <Button className="w-full">{cta.bookText}</Button>
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