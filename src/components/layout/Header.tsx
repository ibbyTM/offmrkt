import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Building2, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { href: "/properties", label: "Browse Deals" },
  { href: "/submit-property", label: "Submit Property" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, hasCompletedQuestionnaire, isAdmin } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    setMobileMenuOpen(false);
  };

  // Build dynamic nav links based on auth state
  const dynamicNavLinks = [...navLinks];
  if (user && hasCompletedQuestionnaire) {
    dynamicNavLinks.push({ href: "/dashboard", label: "Dashboard" });
  }
  if (user && isAdmin) {
    dynamicNavLinks.push({ href: "/admin", label: "Admin" });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-semibold text-xl">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden sm:inline-block">InvestorHub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {dynamicNavLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                isActive(link.href)
                  ? "text-primary bg-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="max-w-[150px] truncate">
                  {user.user_metadata?.full_name || user.email}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2 text-foreground-muted hover:text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container py-4 space-y-2">
            {dynamicNavLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive(link.href)
                    ? "text-primary bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 space-y-2 border-t border-border">
              {user ? (
                <>
                  <div className="px-4 py-2 text-sm text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="truncate">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                  </div>
                  <Button variant="outline" className="w-full" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
