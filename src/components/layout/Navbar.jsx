import { Link, useNavigate } from "react-router-dom";
import { Menu, X, PlusCircle, ChevronDown, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50 rounded-full border border-white/20 bg-background/70 backdrop-blur-xl shadow-lg">
      <div className="px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl font-bold font-display text-primary">
              Masakin
            </span>
          </Link>

          {/* Nav links - Centered */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <Link
              to="/"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              to="/discover"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Discover Recipes
            </Link>
          </div>

          {/* Auth / Right Side */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity py-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs overflow-hidden">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user?.name?.charAt(0) || "U"
                    )}
                  </div>
                  <span className="text-sm font-semibold">
                    {user?.name || "User"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>

                <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-xl shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium hover:bg-secondary transition-colors text-foreground"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link
                    to="/create-recipe"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium hover:bg-secondary transition-colors text-foreground"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Create Recipe
                  </Link>
                  <div className="h-px bg-border my-1" />
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium hover:bg-destructive/10 hover:text-destructive transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/register"
                className="bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3 rounded-b-2xl">
          <Link
            to="/"
            className="block text-sm font-medium py-2"
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/discover"
            className="block text-sm text-muted-foreground py-2"
            onClick={() => setMobileOpen(false)}
          >
            Discover Recipes
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/create-recipe"
                className="block text-sm font-medium py-2"
                onClick={() => setMobileOpen(false)}
              >
                Create Recipe
              </Link>
              <Link
                to="/profile"
                className="block text-sm font-bold text-primary py-2"
                onClick={() => setMobileOpen(false)}
              >
                {user?.name || "Profile"}
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="block text-sm text-muted-foreground py-2 text-left w-full"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/register"
              className="block bg-primary text-primary-foreground text-center px-5 py-2 rounded-full text-sm font-semibold"
              onClick={() => setMobileOpen(false)}
            >
              Get Started
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
