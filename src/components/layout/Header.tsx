import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logo from "@/assets/offthemarkets-logo.png";

const navLinks = [
  { href: "/properties", label: "Browse Deals" },
  { href: "/submit-property", label: "Submit Property" },
];

const landingLinks = [
  { href: "#features", label: "Features" },
  { href: "#properties", label: "Properties" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#services", label: "Services" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
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
  };

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
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    }
  };

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

  const getNavLinks = () => {
    if (user) {
      const links = [...navLinks];
      if (hasCompletedQuestionnaire) {
        links.push({ href: "/dashboard", label: "Dashboard" });
      }
      if (isAdmin) {
        links.push({ href: "/admin", label: "Admin" });
      }
      return links;
    }
    if (isLandingPage) return landingLinks;
    return navLinks;
  };

  const currentNavLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-white rounded-lg p-1">
            <img src={logo} alt="Off The Markets" className="h-8 w-auto" />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 relative">
          {currentNavLinks.map((link) => {
            const active = isActive(link.href);
            return link.href.startsWith("#") ? (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleScrollToSection(e, link.href)}
                className="relative px-4 py-2 text-sm font-medium rounded-full transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-primary/10 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className={cn("relative z-10", active && "text-primary")}>{link.label}</span>
              </a>
            ) : (
              <Link
                key={link.href}
                to={link.href}
                className="relative px-4 py-2 text-sm font-medium rounded-full transition-colors text-muted-foreground hover:text-foreground"
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-primary/10 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className={cn("relative z-10", active && "text-primary")}>{link.label}</span>
              </Link>
            );
          })}
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

        {/* Mobile Menu — Sheet Drawer */}
        <Sheet>
          <SheetTrigger asChild>
            <button
              type="button"
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 pt-12">
            <nav className="space-y-2">
              {currentNavLinks.map((link) =>
                link.href.startsWith("#") ? (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleScrollToSection(e, link.href)}
                    className={cn(
                      "block px-4 py-3 text-sm font-medium rounded-lg transition-colors",
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
                      "block px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                      isActive(link.href)
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              )}
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
                      <Link to="/login">Log in</Link>
                    </Button>
                    <Button className="w-full" asChild>
                      <Link to="/register">Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
