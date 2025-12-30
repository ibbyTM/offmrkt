import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SCROLL_KEY = "properties_scroll_position";

export const useScrollRestoration = () => {
  const { pathname } = useLocation();

  // Save scroll position when leaving /properties
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (pathname === "/properties") {
        sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
      }
    };

    // Save on route change
    return () => {
      if (pathname === "/properties") {
        sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
      }
    };
  }, [pathname]);

  // Restore scroll position when entering /properties
  useEffect(() => {
    if (pathname === "/properties") {
      const savedPosition = sessionStorage.getItem(SCROLL_KEY);
      if (savedPosition) {
        // Small delay to ensure content is rendered
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedPosition, 10));
        }, 100);
      }
    }
  }, [pathname]);
};
