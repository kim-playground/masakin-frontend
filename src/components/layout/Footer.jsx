import { Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] text-white pt-16 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          {/* Brand & Social - Spans 2 cols */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            <h3 className="text-2xl font-bold font-display tracking-tight">
              Masakin<span className="text-primary">.</span>
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              A cooking platform created for those who are obsessed with finding
              cuisines from anywhere in the world. Vote, share, and enjoy!
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:scale-110 transition-all duration-300 group"
                >
                  <Icon className="w-5 h-5 text-white/70 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Links - Spans 1 col each */}
          <div className="space-y-6">
            <h4 className="font-display font-semibold text-lg">Menu</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {["Home", "Discover", "Recipes", "Blog"].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-display font-semibold text-lg">Help</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {["Privacy Policy", "Terms of Use", "FAQ", "Contact"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Newsletter - Spans 2 cols aligned right */}
          <div className="col-span-1 lg:col-span-2 lg:pl-8">
            <h4 className="font-display font-semibold text-lg mb-6">
              Get the freshest news
            </h4>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email..."
                className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all pr-32"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-primary/90 text-white font-medium px-6 rounded-full transition-transform active:scale-95">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-4 ml-4">
              By subscribing, you agree to our Terms & Conditions.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 Masakin. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy style
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Legal notice
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
