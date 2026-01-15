import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { X, Cookie, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const COOKIE_CONSENT_KEY = "cookie_consent";

export interface CookiePreferences {
  essential: true;
  analytics: boolean;
  preferences: boolean;
  marketing: boolean;
  timestamp: string;
}

const defaultPreferences: CookiePreferences = {
  essential: true,
  analytics: false,
  preferences: false,
  marketing: false,
  timestamp: "",
};

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) {
      // Delay showing the banner slightly for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    const prefsWithTimestamp = {
      ...prefs,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefsWithTimestamp));
    setIsVisible(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    savePreferences({
      essential: true,
      analytics: true,
      preferences: true,
      marketing: true,
      timestamp: "",
    });
  };

  const rejectNonEssential = () => {
    savePreferences({
      essential: true,
      analytics: false,
      preferences: false,
      marketing: false,
      timestamp: "",
    });
  };

  const saveCustomPreferences = () => {
    savePreferences(preferences);
  };

  if (!isVisible) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="mx-auto max-w-4xl">
            <div className="rounded-xl border bg-card shadow-lg p-4 md:p-6">
              <div className="flex items-start gap-4">
                <div className="hidden md:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Cookie className="h-5 w-5 text-primary" />
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-foreground">Cookie Preferences</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        We use cookies to enhance your experience. By continuing to visit this site, 
                        you agree to our use of cookies.{" "}
                        <Link to="/cookies" className="text-primary hover:underline">
                          Learn more
                        </Link>
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 -mt-1 -mr-2"
                      onClick={rejectNonEssential}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Close</span>
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <Button onClick={acceptAll} size="sm">
                      Accept All
                    </Button>
                    <Button onClick={rejectNonEssential} variant="outline" size="sm">
                      Reject Non-Essential
                    </Button>
                    <Button
                      onClick={() => setShowSettings(true)}
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Manage Preferences
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Cookie Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cookie Preferences</DialogTitle>
            <DialogDescription>
              Manage your cookie preferences. Essential cookies cannot be disabled as they are 
              required for the site to function properly.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Essential Cookies */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Essential Cookies</Label>
                <p className="text-sm text-muted-foreground">
                  Required for authentication and core functionality
                </p>
              </div>
              <Switch checked disabled />
            </div>

            {/* Preference Cookies */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Preference Cookies</Label>
                <p className="text-sm text-muted-foreground">
                  Remember your settings like theme preference
                </p>
              </div>
              <Switch
                checked={preferences.preferences}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, preferences: checked }))
                }
              />
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Analytics Cookies</Label>
                <p className="text-sm text-muted-foreground">
                  Help us improve by collecting anonymous usage data
                </p>
              </div>
              <Switch
                checked={preferences.analytics}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, analytics: checked }))
                }
              />
            </div>

            {/* Marketing Cookies */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Marketing Cookies</Label>
                <p className="text-sm text-muted-foreground">
                  Used for targeted advertising (not currently in use)
                </p>
              </div>
              <Switch
                checked={preferences.marketing}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, marketing: checked }))
                }
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              Cancel
            </Button>
            <Button onClick={saveCustomPreferences}>
              Save Preferences
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Helper to check cookie consent
export function getCookieConsent(): CookiePreferences | null {
  const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

// Helper to check if a specific cookie type is allowed
export function isCookieAllowed(type: keyof Omit<CookiePreferences, "timestamp">): boolean {
  const consent = getCookieConsent();
  if (!consent) return false;
  return consent[type];
}
