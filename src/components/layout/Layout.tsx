import { Header } from "./Header";
import { Footer } from "./Footer";
import { CookieConsent } from "@/components/legal/CookieConsent";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CookieConsent />
    </div>
  );
}
