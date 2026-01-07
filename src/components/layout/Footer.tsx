import { Link } from "react-router-dom";
import { PawPrint, Heart, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";
import wooFurLogo from "@/assets/woo-fur-logo.png";

interface BrandContent {
  tagline: string;
}

interface ContactContent {
  address: string;
  phone: string;
  email: string;
}

interface CopyrightContent {
  text: string;
}

export const Footer = () => {
  const { getSection } = usePageContent('footer');

  const brand = getSection<BrandContent>('brand', {
    tagline: "Connecting healing animals with humans through therapeutic interactions. Every paw print leaves a lasting impact."
  });

  const contact = getSection<ContactContent>('contact', {
    address: "123 Healing Paws Lane, Greenfield, CA 95000",
    phone: "(555) 123-4567",
    email: "hello@woo-fur.org"
  });

  const copyright = getSection<CopyrightContent>('copyright', {
    text: "Made with love for healing animals"
  });

  return (
    <footer className="bg-foreground text-background pb-20 md:pb-0">
      <div className="container-app py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src={wooFurLogo} 
                alt="Woo-Fur Logo" 
                className="h-10 w-10 rounded-full"
              />
              <span className="font-heading text-xl font-bold">Woo-Fur</span>
            </Link>
            <p className="text-sm text-background/70 leading-relaxed">
              {brand.tagline}
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "Animals", "Programs", "Stories", "About Us"].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/${item === "Home" ? "" : item === "About Us" ? "about" : item.toLowerCase()}`}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold">Our Programs</h4>
            <ul className="space-y-2">
              {["Animal Rescue", "Rehabilitation", "Therapy Sessions", "Part-time Pets"].map((item) => (
                <li key={item}>
                  <Link to="/programs" className="text-sm text-background/70 hover:text-background transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-background/70">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{contact.address}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-background/70">
                <Phone className="h-4 w-4 shrink-0" />
                <span>{contact.phone}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-background/70">
                <Mail className="h-4 w-4 shrink-0" />
                <span>{contact.email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/60">
            © {new Date().getFullYear()} Woo-Fur. All rights reserved.
          </p>
          <p className="text-sm text-background/60 flex items-center gap-1">
            {copyright.text} <Heart className="h-3 w-3 text-accent" />
          </p>
        </div>
      </div>
    </footer>
  );
};
