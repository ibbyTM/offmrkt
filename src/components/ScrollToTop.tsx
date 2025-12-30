import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Skip scroll-to-top for /properties route (handled by useScrollRestoration)
    if (pathname === "/properties") {
      return;
    }
    
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
