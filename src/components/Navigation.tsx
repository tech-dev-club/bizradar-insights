import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Radar, Bookmark, User, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "./ThemeToggle";

const MOBILE_MENU_ID = "primary-mobile-navigation";

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Opportunities", path: "/opportunities" },
    { name: "Idea Analyzer", path: "/idea-analyzer" },
    { name: "Compare", path: "/compare" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group" aria-label="BizRadar home">
            <div className="relative" aria-hidden="true">
              <Radar className="w-8 h-8 text-primary transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              BizRadar
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                aria-current={isActive(link.path) ? "page" : undefined}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary relative group",
                  isActive(link.path) ? "text-primary" : "text-muted-foreground",
                )}
              >
                {link.name}
                {isActive(link.path) && (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"
                  />
                )}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform"
                />
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/saved")}
                  className="flex items-center gap-2"
                >
                  <Bookmark className="w-4 h-4" aria-hidden="true" />
                  Saved Ideas
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate("/auth")}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
              >
                <User className="w-4 h-4 mr-2" aria-hidden="true" />
                Sign In
              </Button>
            )}
          </div>

          <button
            type="button"
            className="md:hidden text-foreground rounded-md p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls={MOBILE_MENU_ID}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div
            id={MOBILE_MENU_ID}
            className="md:hidden py-4 border-t border-border"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  aria-current={isActive(link.path) ? "page" : undefined}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive(link.path) ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {link.name}
                </Link>
              ))}
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/saved")}
                    className="w-full justify-start"
                  >
                    <Bookmark className="w-4 h-4 mr-2" aria-hidden="true" />
                    Saved Ideas
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleSignOut}
                    className="w-full justify-start"
                  >
                    <LogOut className="w-4 h-4 mr-2" aria-hidden="true" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => navigate("/auth")}
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity w-full"
                >
                  <User className="w-4 h-4 mr-2" aria-hidden="true" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
