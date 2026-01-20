import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { Phone, Mail, Building2, ArrowLeft, Shield, Award, Clock, Lock, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useProperty } from "@/hooks/useProperties";
import { formatPrice } from "@/lib/propertyUtils";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Broker details - easily configurable
const MORTGAGE_BROKER = {
  name: "John Smith",
  company: "ABC Mortgages Ltd",
  phone: "+44 7700 900123",
  email: "john@abcmortgages.com",
  bio: "Specialist in buy-to-let and investment property mortgages with 15+ years experience. We help investors secure the best rates for their property portfolio.",
  credentials: "FCA Regulated | Whole of Market Access",
};

type InvestorApplication = Tables<"investor_applications">;
type Profile = Tables<"profiles">;

export default function Mortgage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const propertyId = searchParams.get("propertyId");
  const hasTracked = useRef(false);
  const [investorData, setInvestorData] = useState<InvestorApplication | null>(null);
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { user, loading: authLoading } = useAuth();
  const { data: property, isLoading: propertyLoading } = useProperty(propertyId || "");

  const deposit = property ? Math.round(property.asking_price * 0.25) : 0;
  const mortgageNeeded = property ? property.asking_price - deposit : 0;

  const emailSubject = property 
    ? `Mortgage Enquiry - ${property.title} (${formatPrice(property.asking_price)})`
    : "Mortgage Enquiry";

  // Build enriched email body with investor details
  const buildEmailBody = () => {
    const propertySection = property
      ? `Property: ${property.title}
Address: ${property.property_address}, ${property.property_city} ${property.property_postcode}
Asking Price: ${formatPrice(property.asking_price)}`
      : "an investment property";

    const investorSection = investorData
      ? `
My Investment Profile:
- Budget Range: ${formatPrice(investorData.min_budget)} - ${formatPrice(investorData.max_budget)}
- Cash Available: ${investorData.cash_available || "Not specified"}
- Already Have AIP: ${investorData.mortgage_approved ? "Yes" : "No"}
- Funding Source: ${investorData.funding_source || "Not specified"}
- Purchase Timeline: ${investorData.purchase_timeline || "Not specified"}
- Investment Experience: ${investorData.investment_experience || "Not specified"}
- Properties Owned: ${investorData.properties_owned ?? 0}`
      : "";

    return `Hi ${MORTGAGE_BROKER.name},

I'm interested in getting a mortgage for the following:

${propertySection}
${investorSection}

Please get in touch to discuss my options.

Thank you`;
  };

  // Track referral when user initiates contact
  const trackAndContact = async (method: 'call' | 'email') => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Fetch fresh data if not already loaded
      let investor = investorData;
      let profile = profileData;
      
      if (!investor || !profile) {
        const [investorResult, profileResult] = await Promise.all([
          supabase.from('investor_applications').select('*').eq('user_id', user.id).single(),
          supabase.from('profiles').select('*').eq('user_id', user.id).single()
        ]);
        
        investor = investorResult.data;
        profile = profileResult.data;
        setInvestorData(investor);
        setProfileData(profile);
      }

      // Only track once per session
      if (!hasTracked.current) {
        hasTracked.current = true;
        
        await supabase.from("mortgage_referrals").insert({
          property_id: propertyId || null,
          user_id: user.id,
          referrer_url: document.referrer || null,
          // Investor snapshot
          min_budget: investor?.min_budget || null,
          max_budget: investor?.max_budget || null,
          cash_available: investor?.cash_available || null,
          mortgage_approved: investor?.mortgage_approved || null,
          funding_source: investor?.funding_source || null,
          purchase_timeline: investor?.purchase_timeline || null,
          investment_experience: investor?.investment_experience || null,
          properties_owned: investor?.properties_owned || null,
          needs_mortgage_broker: investor?.needs_mortgage_broker || null,
          // Contact info
          investor_name: profile?.full_name || null,
          investor_email: profile?.email || null,
          investor_phone: profile?.phone || null,
        });
      }

      // Now initiate contact
      if (method === 'call') {
        window.location.href = `tel:${MORTGAGE_BROKER.phone.replace(/\s/g, "")}`;
      } else {
        const emailBody = buildEmailBody();
        window.location.href = `mailto:${MORTGAGE_BROKER.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      }
    } catch (error) {
      console.error("Error tracking referral:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    navigate(`/login?redirect=/mortgage${propertyId ? `?propertyId=${propertyId}` : ''}`);
  };

  const handleSignUp = () => {
    navigate(`/register?redirect=/mortgage${propertyId ? `?propertyId=${propertyId}` : ''}`);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back Button */}
          {propertyId && (
            <Link to={`/properties/${propertyId}`} className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Property
            </Link>
          )}

          {/* Hero Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Get Your Mortgage Sorted</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our trusted mortgage partner specialises in investment property finance and can help you secure the best rates.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Property Summary Card */}
            {propertyId && (
              <Card className="md:col-span-2 border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg">Property Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {propertyLoading ? (
                    <div className="animate-pulse space-y-3">
                      <div className="h-5 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                  ) : property ? (
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-lg">{property.title}</h3>
                        <p className="text-muted-foreground text-sm">
                          {property.property_address}, {property.property_city} {property.property_postcode}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Asking Price</p>
                          <p className="font-semibold text-lg">{formatPrice(property.asking_price)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Deposit (25%)</p>
                          <p className="font-semibold text-lg">{formatPrice(deposit)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Mortgage Needed</p>
                          <p className="font-semibold text-lg">{formatPrice(mortgageNeeded)}</p>
                        </div>
                        {property.estimated_rental_income && (
                          <div>
                            <p className="text-muted-foreground">Est. Monthly Rent</p>
                            <p className="font-semibold text-lg">{formatPrice(property.estimated_rental_income)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Property not found</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Auth Gate or Broker Contact Card */}
            {authLoading ? (
              <Card>
                <CardContent className="p-8">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-muted rounded w-1/2" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-10 bg-muted rounded w-full" />
                  </div>
                </CardContent>
              </Card>
            ) : !user ? (
              <Card className="border-amber-500/30 bg-amber-500/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lock className="h-5 w-5 text-amber-600" />
                    Sign In to Get Mortgage Help
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    To speak with our mortgage specialist and receive personalised rates tailored to your investment profile, please sign in or create an account.
                  </p>
                  
                  <div className="space-y-3">
                    <Button onClick={handleSignIn} className="w-full" size="lg">
                      <LogIn className="mr-2 h-5 w-5" />
                      Sign In
                    </Button>
                    
                    <Button onClick={handleSignUp} variant="outline" className="w-full" size="lg">
                      <UserPlus className="mr-2 h-5 w-5" />
                      Create Account
                    </Button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    Your investment profile helps our broker find the best rates for you.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Mortgage Specialist</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-xl">{MORTGAGE_BROKER.name}</h3>
                    <p className="text-primary font-medium">{MORTGAGE_BROKER.company}</p>
                    <p className="text-sm text-muted-foreground mt-2">{MORTGAGE_BROKER.bio}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>{MORTGAGE_BROKER.credentials}</span>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Button 
                      onClick={() => trackAndContact('call')} 
                      className="w-full" 
                      size="lg"
                      disabled={isLoading}
                    >
                      <Phone className="mr-2 h-5 w-5" />
                      Call Now
                    </Button>
                    
                    <Button 
                      onClick={() => trackAndContact('email')} 
                      variant="outline" 
                      className="w-full" 
                      size="lg"
                      disabled={isLoading}
                    >
                      <Mail className="mr-2 h-5 w-5" />
                      Send Email Enquiry
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Why Use Our Partner */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Why Use Our Partner?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Investment Specialists</h4>
                    <p className="text-sm text-muted-foreground">
                      Expert knowledge in buy-to-let and portfolio mortgages
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Whole of Market</h4>
                    <p className="text-sm text-muted-foreground">
                      Access to all major lenders for the best rates
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Fast Turnaround</h4>
                    <p className="text-sm text-muted-foreground">
                      Quick decisions to help you secure properties faster
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trust Footer */}
          <p className="text-center text-xs text-muted-foreground mt-8">
            Your home may be repossessed if you do not keep up repayments on your mortgage.
            {MORTGAGE_BROKER.company} is authorised and regulated by the Financial Conduct Authority.
          </p>
        </div>
      </div>
    </Layout>
  );
}
