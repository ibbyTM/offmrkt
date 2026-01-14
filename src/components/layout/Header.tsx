import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import logo from "@/assets/offmrkt-logo.png";

const navLinks = [
  { href: "/properties", label: "Browse Deals" },
  { href: "/submit-property", label: "Submit Property" },
];

// Landing page section links for smooth scrolling
const landingLinks = [
  { href: "#features", label: "Features" },
  { href: "#properties", label: "Properties" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, hasCompletedQuestionnaire, isAdmin } = useAuth();

  const isLandingPage = location.pathname === "/";

  const isActive = (path: string) => {
    if (path.startsWith("#")) {
      return activeSection === path.slice(1);
    }
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    setMobileMenuOpen(false);
  };

  // Handle smooth scroll for anchor links
  const handleScrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
      setMobileMenuOpen(false);
    }
  };

  // Track active section on scroll (landing page only)
  useEffect(() => {
    if (!isLandingPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );

    landingLinks.forEach(({ href }) => {
      const element = document.querySelector(href);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [isLandingPage]);

  // Build dynamic nav links based on auth state and current page
  const getNavLinks = () => {
    if (isLandingPage) {
      return landingLinks;
    }

    const links = [...navLinks];
    if (user && hasCompletedQuestionnaire) {
      links.push({ href: "/dashboard", label: "Dashboard" });
    }
    if (user && isAdmin) {
      links.push({ href: "/admin", label: "Admin" });
    }
    return links;
  };

  const currentNavLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="OffMrkt" className="h-14 w-auto object-cover object-center" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {currentNavLinks.map((link) => (
            link.href.startsWith("#") ? (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleScrollToSection(e, link.href)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer",
                  isActive(link.href)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive(link.href)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {link.label}
              </Link>
            )
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="max-w-[150px] truncate">
                  {user.user_metadata?.full_name || user.email}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground hover:text-foreground">
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
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
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
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
            {currentNavLinks.map((link) => (
              link.href.startsWith("#") ? (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleScrollToSection(e, link.href)}
                  className={cn(
                    "block px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer",
                    isActive(link.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive(link.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {link.label}
                </Link>
              )
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
